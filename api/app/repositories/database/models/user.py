from dataclasses import dataclass


@dataclass
class User:

    user_sub: str
    user_email: str
    pub_key_path: str
    last_pub_key_update: int
    status: str
    last_update: str

    class Meta:
        tablename: str = 'users'
