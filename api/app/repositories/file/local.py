from math import pow
from typing import Optional

import aiofiles
import aiofiles.os
from app.exceptions.file import (FileTypeNotAllowedException,
                                 MaxFileSizeException)
from fastapi import UploadFile

from ..utils import FilenameFunctions


class LocalFileManager:

    class ErrorMessages:
        TYPE_NOT_ALLOWED: str = ''
        MAX_SIZE_EXCEDED: str = ''

    class Constants:
        MAX_FILE_SIZE: int = 2000000
        LOCAL_PATH: str = './temp'

    @classmethod
    async def download_file(cls, file: UploadFile, file_type: str, allowed_extensions: Optional[set] = None,
                            max_size: int = Constants.MAX_FILE_SIZE, local_path: str = Constants.LOCAL_PATH,
                            timestamp_file: bool = True):

        extension = file.filename.split('.')[-1]
        if allowed_extensions and extension not in allowed_extensions:
            raise FileTypeNotAllowedException({
                'message': cls.ErrorMessages.TYPE_NOT_ALLOWED.format(','.join(allowed_extensions))
            })

        result_path = f'{local_path}/{FilenameFunctions.timestamp_filename(file.filename) if timestamp_file else file.filename}'
        temp_path = f'{local_path}/{FilenameFunctions.timestamp_filename("temp")}'
        file_size = 0
        async with aiofiles.open(temp_path, 'wb') as temp:
            for chunk in file.file:
                file_size += len(chunk)
                if file_size > max_size:
                    await aiofiles.os.remove(temp_path)
                    raise MaxFileSizeException({
                        'message': cls.ErrorMessages.MAX_SIZE_EXCEDED.format(file_type, max_size / pow(1024, 2))
                    })
                await temp.write(chunk)

        await aiofiles.os.rename(temp_path, result_path)
        return result_path
