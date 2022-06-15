from pathlib import Path
from typing import Optional

import aiofiles
from app.config.env_manager import EnvManager

from ..filesystem.utils import FilenameFunctions


class S3Manager:

    s3_bucket = EnvManager.S3_BUCKET_NAME
    local_temp_folder = EnvManager.TEMP_FOLDER

    @classmethod
    async def download_object(cls, s3, path: str, file_name: Optional[str] = None, bucket_name: str = s3_bucket,
                              to_temp_folder: bool = False, chunk_size: int = 69 * 1024):
        temp_filename = FilenameFunctions.timestamp_filename('temp') if not file_name else file_name
        local_filename = temp_filename if not to_temp_folder else f'{cls.local_temp_folder}/{temp_filename}'
        path_bucket, path_filename, path_location = cls.get_bucket_path_name_split(path)
        object_key = path_filename if not path_location else f'{path_location}/{path_filename}'

        s3object = await s3.get_object(Bucket=bucket_name or path_bucket, Key=object_key)

        async with s3object['Body'] as stream:
            data = await stream.read()
            async with aiofiles.open(local_filename, 'wb') as f:
                await f.write(data)
        return local_filename

    @classmethod
    async def upload_object(cls, s3, file_name: str, bucket_name: str = s3_bucket, up_path: Optional[str] = None,
                            up_filename: str = '', from_temp_folder: bool = False):
        up_filename = up_filename or (f'{up_path}/{file_name}' if up_path else file_name)
        s3_filename = FilenameFunctions.get_filename_from_path(up_filename) if not from_temp_folder else up_filename

        with Path(file_name if not from_temp_folder else f'{cls.local_temp_folder}/{file_name}').open('rb') as up_file:
            await s3.upload_fileobj(up_file, bucket_name, s3_filename)

        return f's3://{bucket_name}/{s3_filename}'

    @classmethod
    async def download_from_folder(cls, s3, folder_path: str, file_types: list, bucket_name: str = s3_bucket, local_path: str = local_temp_folder):
        def filter_file_types(s3_object, types: set):
            return s3_object.key.split('.')[-1] in types

        file_names = []
        bucket = await s3.Bucket(bucket_name)
        async for item in bucket.objects.filter(Prefix=f'{folder_path}/'):
            if filter_file_types(item, set(file_types)):
                file_name = item.key.split('/')[-1]
                await cls.download_object(s3, bucket_name, folder_path, file_name, local_path)
                file_names.append(f'{local_path}/{file_name}')

        return file_names

    @staticmethod
    def get_bucket_path_name_split(s3_path: str) -> tuple:
        if s3_path.startswith('s3://'):
            s3_path = s3_path.strip('s3://')
            split_path = s3_path.split('/')
            return split_path[0], split_path[-1], '/'.join(split_path[1:-1])
        else:
            return '', '', ''
