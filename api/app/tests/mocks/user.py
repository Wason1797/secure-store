from datetime import datetime

from app.tests.utils.functions import get_random_email, get_random_string


def mock_user(status: str = 'ACTIVE'):
    timestamp = str(int(datetime.now().timestamp()))
    return {
        'user_sub': get_random_string(),
        'user_email': get_random_email(),
        'pub_key_path': 's3://bucket/key.pub',
        'last_pub_key_update': timestamp,
        'status': status,
        'last_update': timestamp
    }
