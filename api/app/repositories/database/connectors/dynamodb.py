import aioboto3
from app.config.env_manager import EnvManager


class DynamoDBConnector:
    session = aioboto3.Session(aws_access_key_id=EnvManager.AWS_ACCESS_KEY_ID,
                               aws_secret_access_key=EnvManager.AWS_SECRET_ACCESS_KEY,
                               region_name=EnvManager.AWS_DYNAMODB_REGION)

    aws_endpoint = EnvManager.AWS_ENDPOINT

    @classmethod
    async def get_db(cls):
        async with cls.session.resource('dynamodb', endpoint_url=cls.aws_endpoint) as db:
            yield db
