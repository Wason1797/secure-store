from typing import List, Optional

from app.crypto.rsa_functions import RSAEncryption
from app.repositories.database.connectors import DynamoDBConnector
from app.repositories.database.managers.secret import SecretManager
from app.repositories.database.managers.user import UserManager
from app.repositories.filesystem.local import LocalFileManager
from app.repositories.object_storage.s3 import S3Manager
from app.serializers.secrets import SecretBase as SecretBasicSerializer
from app.serializers.secrets import SecretFull as SecretFullSerializer
from app.serializers.secrets import ShareSecretsPayload
from fastapi import APIRouter, BackgroundTasks, Depends

from ..security.validators import get_user

router = APIRouter()


@router.get('/shared-with-me', response_model=List[SecretFullSerializer])
async def shared_with_me(user: Optional[dict] = Depends(get_user), db=Depends(DynamoDBConnector.get_db)):
    # Fetch secrets stored in database by user id
    secrets = await SecretManager.shared_with_me(db, user.get('sub'))
    return secrets


@router.post('/share', response_model=List[SecretBasicSerializer])
async def share_secrets(background_tasks: BackgroundTasks, payload: ShareSecretsPayload, db=Depends(DynamoDBConnector.get_db),
                        user: Optional[dict] = Depends(get_user)):

    user_emails_to_share = set(payload.users)
    current_users = await UserManager.get_all(db)
    users_to_share = [user for user in current_users if user.user_email in user_emails_to_share]

    result, paths_to_clean = await SecretManager.share_secrets(db, user.get('email'), user.get('sub'), users_to_share, payload.secrets,
                                                               RSAEncryption, S3Manager)
    background_tasks.add_task(LocalFileManager.clean_files, paths_to_clean)

    return result
