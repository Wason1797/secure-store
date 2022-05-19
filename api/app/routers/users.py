from typing import Optional

from app.repositories.database.local import LocalStorage
from fastapi import APIRouter, Depends

from ..security.validators import get_user

router = APIRouter()


@router.get('/')
async def get_users(user: Optional[dict] = Depends(get_user)):
    users = tuple(LocalStorage.get_storage().get_data().keys())

    return {'users': users}


@router.get('/session/active')
async def get_active_session_user(user: Optional[dict] = Depends(get_user)):
    return user
