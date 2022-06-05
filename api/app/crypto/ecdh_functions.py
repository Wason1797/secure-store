from typing import Tuple, Union

from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.hashes import SHA256, HashAlgorithm
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat


class ECDHExchange:
    elliptic_curve: ec.EllipticCurve = ec.SECP256R1()
    hash_algorithm: HashAlgorithm = SHA256()

    @classmethod
    def generate_keys(cls) -> Tuple[ec.EllipticCurvePrivateKey, str]:
        private_key = ec.generate_private_key(cls.elliptic_curve)
        public_key = private_key.public_key().public_bytes(Encoding.DER, PublicFormat.SubjectPublicKeyInfo)
        return private_key, public_key.hex()

    @classmethod
    def import_public_key(cls, public_key_hex: str) -> ec.EllipticCurvePublicKey:
        public_key_bytes = bytes.fromhex(public_key_hex)
        return ec.EllipticCurvePublicKey.from_encoded_point(cls.elliptic_curve, public_key_bytes)

    @classmethod
    def derive_shared_hkdf_key(cls, client_public_key: str, server_private_key: ec.EllipticCurvePrivateKey, raw: bool = False) -> Union[str, bytes]:
        client_public_key = cls.import_public_key(client_public_key)
        shared_key = server_private_key.exchange(ec.ECDH(), client_public_key)
        derived_key = HKDF(algorithm=cls.hash_algorithm, length=32, salt=None, info=None).derive(shared_key)
        return derived_key if raw else derived_key.hex()
