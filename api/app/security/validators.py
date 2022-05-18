from fastapi import Request, HTTPException
from typing import Optional
import time


async def get_user(request: Request) -> Optional[dict]:
    user = request.session.get('user', {})
    if not user or user.get('exp') < time.time():
        raise HTTPException(status_code=403, detail='Could not validate credentials.')
    else:
        return user
