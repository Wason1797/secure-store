
from typing import Callable, Optional, Type
from ..models.cached_key import CachedKey


class CachedKeyManager:

    model = CachedKey
    ttl: int = 100

    @classmethod
    async def get_key_for_user(cls, db, user_sub: str, decrypt: Optional[Callable] = None) -> Type[model]:
        key = await db.get(user_sub)
        return cls.model(user_sub, decrypt(key) if decrypt else key)

    @classmethod
    async def set_key_for_user(cls, db, user_sub: str, key: str, encrypt: Optional[Callable] = None) -> Type[model]:
        await db.set(user_sub, encrypt(key) if encrypt else key)
        await db.expire(user_sub, cls.ttl)
        return cls.model(user_sub, key)
