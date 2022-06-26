from datetime import datetime

import pytest
from app.repositories.database.managers import UserManager
from app.tests.utils.functions import get_random_email, get_random_string


@pytest.fixture
async def user_in_db(dynamo_db_session):
    timestamp = str(int(datetime.now().timestamp()))
    user = {
        'user_sub': get_random_string(),
        'user_email': get_random_email(),
        'pub_key_path': 's3://bucket/key.pub',
        'last_pub_key_update': timestamp,
        'status': 'ACTIVE',
        'last_update': timestamp
    }
    result = await UserManager.put_item(dynamo_db_session, user)
    return result.first(raw=True)


@pytest.mark.anyio
async def test_query_by_primary_key(dynamo_db_session, user_in_db):
    result = await UserManager.query_by_primary_key(dynamo_db_session, 'user_sub', user_in_db['user_sub'])
    fetched_user = result.first()
    assert fetched_user
    for key, value in fetched_user.asdict().items():
        assert user_in_db[key] == value
