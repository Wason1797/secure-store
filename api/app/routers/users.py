from typing import List, Optional

from app.repositories.database.connectors import DynamoDBConnector
from app.repositories.database.managers.user import UserManager
from app.serializers.user import SessionUser as SessionUserSerializer
from app.serializers.user import UserBase as UserBaseSerializer
from fastapi import APIRouter, Depends

from ..security.validators import get_user

router = APIRouter()


@router.get('/', response_model=List[UserBaseSerializer])
async def get_users(user: Optional[dict] = Depends(get_user), db=Depends(DynamoDBConnector.get_db)):
    users = await UserManager.get_all(db)
    return users


@router.get('/current', response_model=SessionUserSerializer)
async def get_active_user(user: Optional[dict] = Depends(get_user)):
    return SessionUserSerializer(**user)
