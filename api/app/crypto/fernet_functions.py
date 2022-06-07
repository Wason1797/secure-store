from typing import Optional, Union
from base64 import urlsafe_b64encode

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC


class FernetEncryption:

    manager: Optional[Fernet] = None

    @classmethod
    def init_ecryption_manager(cls, secret: str, salt: str):
        if cls.manager:
            raise RuntimeError('FernetEncryption already initialized')

        salt = bytes.fromhex(salt)  # generated through os.urandom(16).hex()
        kdf = PBKDF2HMAC(
            algorithm=SHA256(),
            length=32,
            salt=salt,
            iterations=390000
        )
        key = urlsafe_b64encode(kdf.derive(secret.encode()))
        cls.manager = Fernet(key)

    @classmethod
    def encrypt(cls, data: Union[bytes, str], encoding: str = 'UTF-8', raw: bool = False) -> Union[bytes, str]:
        data = data if isinstance(data, bytes) else data.encode(encoding=encoding)
        cyphertext = cls.manager.encrypt(data)
        return cyphertext if raw else cyphertext.hex()

    @classmethod
    def decrypt(cls, cyphertext: Union[bytes, str], encoding: str = 'UTF-8', raw: bool = False):
        cyphertext = cyphertext if isinstance(cyphertext, bytes) else bytes.fromhex(cyphertext)
        message = cls.manager.decrypt(cyphertext)
        return message if raw else message.decode(encoding=encoding)
