from typing import Union

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


class AESEncryption:

    @staticmethod
    def decode_and_strip(decrypted_data: bytes) -> str:
        return ''.join(character for character in decrypted_data.decode() if character.isprintable())

    @classmethod
    def decrypt(cls, key: str, iv: str, data: str, raw: bool = False) -> Union[str, bytes]:
        key = bytes.fromhex(key)
        iv = bytes.fromhex(iv)
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
        decryptor = cipher.decryptor()
        decrypted_data = decryptor.update(bytes.fromhex(data)) + decryptor.finalize()
        return decrypted_data if raw else cls.decode_and_strip(decrypted_data)
