from pydantic import BaseModel
from pydantic.networks import EmailStr


class UserBase(BaseModel):

    user_email: EmailStr
    status: str

    class Config:
        orm_mode = True


class UserFull(UserBase):

    user_sub: str
    pub_key_path: str
    last_pub_key_update: int
    last_update: str


class SessionUser(BaseModel):
    name: str
    exp: float
    email: EmailStr
    picture: str
