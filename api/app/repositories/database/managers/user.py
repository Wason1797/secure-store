from datetime import datetime

from ..models.user import User
from .base import BaseManager


class UserManager(BaseManager):
    model = User

    @classmethod
    async def add_or_update_public_key(cls, db, user_data: dict):
        current_user = await cls.get_items(db, 'user_sub', user_data.get('sub'))
        if not current_user:
            current_timestamp = int(datetime.now().timestamp())
            new_user = await cls.put_item(db, cls.model(
                user_sub=user_data.get('sub'),
                user_email=user_data.get('email'),
                pub_key_path=user_data.get('pub_key_path'),
                last_pub_key_update=current_timestamp,
                status='ACTIVE',
                last_update=current_timestamp
            ))
            return new_user
        return current_user
