import json
from datetime import datetime
from itertools import islice
from sys import getsizeof
from uuid import uuid4

from ..models.secrets import Secret
from .base import BaseManager


class SecretManager(BaseManager):
    model = Secret
    max_secret_size: int = 200

    @classmethod
    def split_dict(cls, data: dict):
        current_size = getsizeof(data)
        chunks = current_size//cls.max_secret_size
        it = iter(data)
        for _ in range(0, len(data), chunks):
            yield {k: data[k] for k in islice(it, chunks)}

    @classmethod
    async def share_secrets(cls, db, sender_email: str, sender_sub: str, recipient_list: list, shared_key: str, encrypted_secrets: dict,
                            rsa_encryption_manager: object, aes_encryption_manager: object, object_storage: object):

        decrypted_secrets = {key: aes_encryption_manager.decrypt(shared_key, value.iv, value.secret)
                             for key, value in encrypted_secrets.items()}
        secret_chunks = list(cls.split_dict(decrypted_secrets))
        secrets = []
        paths_to_clean = []

        for user in recipient_list:
            public_key_path = await object_storage.download_object(user.pub_key_path, to_temp_folder=True)
            public_key = await rsa_encryption_manager.read_pub_key(public_key_path)
            paths_to_clean.append(public_key_path)
            for secret_chunk in secret_chunks:
                encrypted_value = rsa_encryption_manager.encrypt_with_pub_key(json.dumps(secret_chunk), public_key)
                secrets.append({
                    'recipient_sub': user.user_sub,
                    'recipient_email': user.user_email,
                    'created_at': int(datetime.now().timestamp()),
                    'secret_id': str(uuid4()),
                    'secret': encrypted_value,
                    'sender_sub': sender_sub,
                    'sender_email': sender_email
                })

        result = await cls.batch_write(db, secrets)
        return result.all(), paths_to_clean

    @classmethod
    async def shared_with_me(cls, db, user_sub: str) -> list:
        result = await cls.scan(db, {'recipient_sub': user_sub})
        return result.all()
