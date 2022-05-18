from authlib.integrations.starlette_client import OAuth
from ..config.env_manager import EnvManager

oauth_client = OAuth(EnvManager)

oauth_client.register(
    name='google',
    server_metadata_url=EnvManager.OAUTH_CONFIG_URL,
    client_kwargs={
        'scope': 'openid email profile'
    }
)
