import pytest
from app.repositories.database.managers import UserManager
from app.tests.mocks.user import mock_user


@pytest.fixture
async def user_in_db(dynamo_db_session):
    user = mock_user()
    result = await UserManager.put_item(dynamo_db_session, user)
    return result.first(raw=True)


@pytest.mark.anyio
@pytest.mark.parametrize(('users', 'filters'), (
    ([], {}),
    ([mock_user('TEST_1') for _ in range(10)], {'status': 'TEST_1'}),
    ([mock_user('TEST_2')], {'status': 'TEST_2'}),
))
async def test_scan(dynamo_db_session, users, filters):
    for user in users:
        await UserManager.put_item(dynamo_db_session, user)

    result = await UserManager.scan(dynamo_db_session, filters)
    user_set = set(tuple(user.items()) for user in users)
    result_user_set = set(tuple(db_user.items()) for db_user in result.all(raw=True))
    assert len(user_set & result_user_set) == len(users)


@pytest.mark.anyio
async def test_put_item(dynamo_db_session):
    user = mock_user()
    result = await UserManager.put_item(dynamo_db_session, user)
    result_user = result.first(raw=True)
    assert user == result_user

    db_user = (await UserManager.query_by_primary_key(dynamo_db_session, 'user_sub', user['user_sub'])).first(raw=True)
    assert db_user == user


@pytest.mark.anyio
async def test_query_by_primary_key(dynamo_db_session, user_in_db):
    result = await UserManager.query_by_primary_key(dynamo_db_session, 'user_sub', user_in_db['user_sub'])
    fetched_user = result.first()
    assert fetched_user
    assert fetched_user.asdict() == user_in_db


@pytest.mark.anyio
async def test_batch_write(dynamo_db_session):
    def sort_users(users: list):
        return sorted(users, key=lambda user: user['user_sub'])

    users = sort_users([mock_user('TEST_3') for _ in range(10)])
    result_users = (await UserManager.batch_write(dynamo_db_session, users)).all(raw=True)

    for user, result_user in zip(users, sort_users(result_users)):
        assert user == result_user

    scan_users = (await UserManager.scan(dynamo_db_session, {'status': 'TEST_3'})).all(raw=True)

    for user, scan_user in zip(users, sort_users(scan_users)):
        assert user == scan_user


@pytest.mark.anyio
async def test_update_item(dynamo_db_session):
    user = mock_user()
    await UserManager.put_item(dynamo_db_session, user)
    user_sub_filter = {'user_sub': user['user_sub']}
    updated_user = (await UserManager.update_item(dynamo_db_session, user_sub_filter,
                                                  {**user_sub_filter, 'user_email': user['user_email']},
                                                  {
                                                      'pub_key_path': 'new path',
                                                      'last_pub_key_update': 'today',
                                                      'last_update': 'today'
                                                  })).first(raw=True)
    user_in_db = (await UserManager.query_by_primary_key(dynamo_db_session, 'user_sub', user['user_sub'])).first(raw=True)
    assert user_in_db == updated_user
