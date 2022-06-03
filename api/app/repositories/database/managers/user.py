from datetime import datetime

from ..models.user import User
from .base import BaseManager


class UserManager(BaseManager):
    model = User

    @classmethod
    async def add_or_update_public_key(cls, db, user_data: dict):
        user_sub = user_data.get('sub')
        pub_key_path = user_data.get('pub_key_path')
        result = await cls.query_by_primary_key(db, 'user_sub', user_sub)

        current_timestamp = int(datetime.now().timestamp())

        if (current_user := result.first()):
            update_result = await cls.update_item(db,
                                                  {'user_sub': current_user.user_sub},
                                                  {'user_sub': current_user.user_sub, 'user_email': current_user.user_email},
                                                  {'pub_key_path': pub_key_path, 'last_pub_key_update': current_timestamp})
            return update_result.first()

        put_result = await cls.put_item(db, cls.model(
            user_sub=user_sub,
            user_email=user_data.get('email'),
            pub_key_path=pub_key_path,
            last_pub_key_update=current_timestamp,
            status='ACTIVE',
            last_update=current_timestamp
        ))
        return put_result.first()

    @classmethod
    async def get_all(cls, db) -> list:
        result = await cls.scan(db)
        return result.filter(lambda user: user.get('status') == 'ACTIVE')
