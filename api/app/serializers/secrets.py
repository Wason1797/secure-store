from typing import List
from pydantic import BaseModel
from pydantic.networks import EmailStr


class ShareSecretsPayload(BaseModel):
    users: List[EmailStr]
    secrets: dict


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
