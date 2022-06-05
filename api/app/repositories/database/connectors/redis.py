from typing import Optional
from aioredis import from_url, Redis
from app.config.env_manager import EnvManager


class RedisConnector:

    DB_URL: str = EnvManager.MEMORY_DB_URL
    db: Optional[Redis] = None

    @classmethod
    def get_db(cls) -> Redis:
        if not cls.db:
            raise ConnectionError('get_db() called before database initialization')
        return cls.db

    @classmethod
    def init_db(cls) -> None:
        if not cls.db:
            cls.db = from_url(cls.DB_URL, decode_responses=True)
