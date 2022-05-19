import os


class EnvManager:
    OAUTH_CONFIG_URL: str = os.environ['OAUTH_CONFIG_URL']
    GOOGLE_CLIENT_ID: str = os.environ['GOOGLE_CLIENT_ID']
    GOOGLE_CLIENT_SECRET: str = os.environ['GOOGLE_CLIENT_SECRET']
    SESSION_SECRET: str = os.environ['SESSION_SECRET']
    SECURE_STORE_UI_URL: str = os.environ['SECURE_STORE_UI_URL']

    @classmethod
    def get(cls, key, default=None):
        return cls.__dict__.get(key, default)
