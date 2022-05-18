from typing import Optional

from app.repositories.database.local import LocalStorage
from app.repositories.file.local import LocalFileManager
from fastapi import APIRouter, Depends, File, UploadFile

from ..security.validators import get_user

router = APIRouter()


@router.post('/upload')
async def upload_public_key(user: Optional[dict] = Depends(get_user), public_key: UploadFile = File(...)):
    public_key_local_path = await LocalFileManager.download_file(public_key, 'Public Key')
    # Upload to s3
    s3_public_key_path = public_key_local_path
    # Store path with user id and email
    LocalStorage.get_storage().set_data(user.get('email'), {'public_key_path': s3_public_key_path})

    # Clean temp files

    return {'Message': 'public_key_stored'}
