from typing import Optional

import aioboto3
from app.config.env_manager import EnvManager


class S3Connector:
    session: Optional[aioboto3.Session] = None
    aws_endpoint = EnvManager.AWS_ENDPOINT

    @classmethod
    def init_storage(cls) -> None:
        if not cls.session:
            cls.session = aioboto3.Session(aws_access_key_id=EnvManager.AWS_ACCESS_KEY_ID,
                                           aws_secret_access_key=EnvManager.AWS_SECRET_ACCESS_KEY)

    @classmethod
    async def get_storage(cls):
        if not cls.session:
            raise ConnectionError('get_storage() called before session initializacion')

        async with cls.session.client('s3', endpoint_url=cls.aws_endpoint) as s3:
            yield s3
