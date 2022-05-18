from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def index():
    return {"safe-store api version": "0.0"}
