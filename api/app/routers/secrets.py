from typing import Optional

import aiofiles
import json
import base64
from app.repositories.database.local import LocalStorage
from app.serializers.secrets import ShareSecretsPayload
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
from fastapi import APIRouter, Depends
from uuid import uuid4

from ..security.validators import get_user

router = APIRouter()


@router.get('/shared-with-me')
async def shared_with_me(user: Optional[dict] = Depends(get_user)):
    # Fetch secrets stored in database by user id

    secrets = LocalStorage.get_storage().get_data()[user.get('email')].get('secrets', {})

    return {'secrets': secrets}


@router.post('/share')
async def share_secrets(payload: ShareSecretsPayload, user: Optional[dict] = Depends(get_user)):

    async def encrypt(value: str, key: str):
        async with aiofiles.open(key, "rb") as key_file:
            key_in_memory = await key_file.read()

        public_key = serialization.load_pem_public_key(
            key_in_memory,
            backend=default_backend()
        )

        return base64.b64encode(public_key.encrypt(
            value.encode('utf-8'),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )).decode('utf-8')

    for user_to_share in payload.users:
        user_to_share_data = LocalStorage.get_storage().get_data()[user_to_share]
        key_path = user_to_share_data.get('public_key_path')
        secrets = dict(**user_to_share_data.get('secrets', {}),
                       **{str(uuid4()): await encrypt(json.dumps(payload.secrets), key_path)})
        LocalStorage.get_storage().get_data()[user_to_share]['secrets'] = secrets

    return LocalStorage.get_storage().get_data()[user_to_share]
