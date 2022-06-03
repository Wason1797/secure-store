import base64

import aiofiles
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding


class RSAEncryption:

    encoding: str = 'UTF-8'

    @staticmethod
    async def read_pub_key(pub_key_path: str) -> bytes:
        async with aiofiles.open(pub_key_path, 'rb') as key_file:
            key_in_memory = await key_file.read()
        return key_in_memory

    @classmethod
    def encrypt_with_pub_key(cls, value: str, key: bytes):

        public_key = serialization.load_pem_public_key(
            key,
            backend=default_backend()
        )

        return base64.b64encode(public_key.encrypt(
            value.encode(cls.encoding),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )).decode(cls.encoding)
