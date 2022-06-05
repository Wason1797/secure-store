from typing import Optional

from app.repositories.database.connectors import DynamoDBConnector
from app.repositories.database.managers import UserManager
from app.repositories.filesystem.local import LocalFileManager
from app.repositories.object_storage.s3 import S3Manager
from app.security.validators import get_user
from app.serializers.user import UserFull as UserSerializer
from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile

router = APIRouter()


@router.post('/', response_model=UserSerializer)
async def upload_public_key(background_tasks: BackgroundTasks, user: Optional[dict] = Depends(get_user),
                            db=Depends(DynamoDBConnector.get_db), public_key: UploadFile = File(...)):
    public_key_local_path = await LocalFileManager.download_file(public_key, 'Public Key', allowed_extensions={'pub'})
    # Upload to s3
    s3_public_key_path = await S3Manager.upload_object(public_key_local_path)
    # Clean temp files
    background_tasks.add_task(LocalFileManager.clean_files, (public_key_local_path,))

    # Store path with user id and email
    user_result = await UserManager.add_or_update_public_key(db, {**user, 'pub_key_path': s3_public_key_path})

    return user_result
