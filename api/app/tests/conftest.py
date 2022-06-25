import pytest
from app.main import app
from app.config.env_manager import EnvManager
from app.repositories.database.connectors import DynamoDBConnector
from app.repositories.object_storage.connectors import S3Connector
from app.security.validators import get_user
from fastapi.testclient import TestClient
from moto.server import ThreadedMotoServer

from .mocks.oauth_user import mock_get_user
from .mocks.aws_infra import create_bucket, create_dynamodb_table

app.dependency_overrides[get_user] = mock_get_user

moto_server = ThreadedMotoServer(ip_address='127.0.0.1', port=5050, verbose=False)


@pytest.fixture(scope='session')
def anyio_backend():
    return 'asyncio'


@pytest.fixture
def client():
    yield TestClient(app)


@pytest.fixture(scope='session')
async def dynamo_db_session():
    connector = DynamoDBConnector.get_db()
    yield await connector.__anext__()
    await connector.aclose()


@pytest.fixture(scope='session')
async def s3_storage_session():
    connector = S3Connector.get_storage()
    yield await connector.__anext__()
    await connector.aclose()


@pytest.fixture(scope='session')
def test_temp_folder(tmp_path_factory):
    return tmp_path_factory.mktemp('test_temp')


def pytest_configure(config):
    moto_server.start()
    create_bucket(EnvManager.S3_BUCKET_NAME, EnvManager.AWS_ENDPOINT, 'us-east-1')
    for table, key in (('users', 'user_sub'), ('secrets', 'secret_id')):
        create_dynamodb_table(table, key, EnvManager.AWS_ENDPOINT, 'us-east-1')
    DynamoDBConnector.init_db()
    S3Connector.init_storage()


def pytest_sessionfinish(session, exitstatus):
    moto_server.stop()
