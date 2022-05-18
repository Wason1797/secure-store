from typing import List
from pydantic import BaseModel
from pydantic.networks import EmailStr


class ShareSecretsPayload(BaseModel):
    users: List[EmailStr]
    secrets: dict
