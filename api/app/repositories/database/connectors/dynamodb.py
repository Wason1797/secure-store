from typing import Optional
import aioboto3
from app.config.env_manager import EnvManager


class DynamoDBConnector:
    session: Optional[aioboto3.Session] = None
    aws_endpoint = EnvManager.AWS_ENDPOINT

    @classmethod
    def init_db(cls) -> None:
        if not cls.session:
            cls.session = aioboto3.Session(aws_access_key_id=EnvManager.AWS_ACCESS_KEY_ID,
                                           aws_secret_access_key=EnvManager.AWS_SECRET_ACCESS_KEY,
                                           region_name=EnvManager.AWS_DYNAMODB_REGION)

    @classmethod
    async def get_db(cls):
        if not cls.session:
            raise ConnectionError('get_db() called before session initializacion')

        async with cls.session.resource('dynamodb', endpoint_url=cls.aws_endpoint) as db:
            yield db
