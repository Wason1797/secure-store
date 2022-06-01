from pydantic import BaseModel
from pydantic.networks import EmailStr


class User(BaseModel):

    user_sub: str
    user_email: EmailStr
    pub_key_path: str
    last_pub_key_update: int
    status: str
    last_update: str

    class Config:
        orm_mode = True
