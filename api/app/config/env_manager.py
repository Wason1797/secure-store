import os


class EnvManager:
    OAUTH_CONFIG_URL: str = os.environ['OAUTH_CONFIG_URL']
    GOOGLE_CLIENT_ID: str = os.environ['GOOGLE_CLIENT_ID']
    GOOGLE_CLIENT_SECRET: str = os.environ['GOOGLE_CLIENT_SECRET']
    SESSION_SECRET: str = os.environ['SESSION_SECRET']
    SECURE_STORE_UI_URL: str = os.environ['SECURE_STORE_UI_URL']
    AWS_ACCESS_KEY_ID: str = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY: str = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_ENDPOINT: str = os.getenv('AWS_ENDPOINT')
    S3_BUCKET_NAME: str = os.environ['S3_BUCKET_NAME']
    AWS_DYNAMODB_REGION: str = os.environ['AWS_DYNAMODB_REGION']
    TEMP_FOLDER: str = os.getenv('TEMP_FOLDER', './temp')
    MEMORY_DB_URL: str = os.environ['MEMORY_DB_URL']

    @classmethod
    def get(cls, key, default=None):
        return cls.__dict__.get(key, default)
