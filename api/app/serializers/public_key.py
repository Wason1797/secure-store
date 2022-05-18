from fastapi import File, UploadFile
from pydantic import BaseModel


class PublicKeyUpload(BaseModel):
    public_key: UploadFile = File(...)
