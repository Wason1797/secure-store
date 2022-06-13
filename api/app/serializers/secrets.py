from typing import List, Dict
from pydantic import BaseModel
from pydantic.networks import EmailStr


class SecretWithIv(BaseModel):
    secret: str
    iv: str


class ShareSecretsPayload(BaseModel):
    users: List[EmailStr]
    secrets: Dict[str, SecretWithIv]


class SecretBase(BaseModel):
    secret_id: str
    recipient_email: EmailStr
    created_at: int
    sender_email: EmailStr


class SecretFull(SecretBase):
    recipient_sub: str
    sender_sub: str
    secret: str


class KeyAgreementPayload(BaseModel):
    public_key: str


class KeyAgreementResponse(BaseModel):
    server_public_key: str
