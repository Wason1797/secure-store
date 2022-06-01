from pathlib import Path
from typing import Optional

import aioboto3
from app.config.env_manager import EnvManager
from ..filesystem.utils import FilenameFunctions


class S3Manager:

    session = aioboto3.Session(aws_access_key_id=EnvManager.AWS_ACCESS_KEY_ID,
                               aws_secret_access_key=EnvManager.AWS_SECRET_ACCESS_KEY)

    aws_endpoint = EnvManager.AWS_ENDPOINT
    s3_bucket = EnvManager.S3_BUCKET_NAME
    local_temp_folder = EnvManager.TEMP_FOLDER

    @classmethod
    async def download_object(cls, path: str, file_name: str, bucket_name: str = s3_bucket,
                              from_temp_folder: bool = False, chunk_size: int = 69 * 1024):
        local_filename = file_name if not from_temp_folder else f'{cls.local_temp_folder}/{file_name}'
        async with cls.session.client('s3', endpoint_url=cls.aws_endpoint) as s3:
            s3object = await s3.get_object(Bucket=bucket_name, Key=f'{path}/{file_name}')

            async with s3object['Body'] as stream:
                data = await stream.read(chunk_size)
                with open(local_filename, 'wb') as f:
                    while data:
                        f.write(data)
                        data = await stream.read(chunk_size)
        return local_filename

    @classmethod
    async def upload_object(cls, file_name: str, bucket_name: str = s3_bucket, up_path: Optional[str] = None,
                            up_filename: str = '', from_temp_folder: bool = False):
        up_filename = up_filename or (f'{up_path}/{file_name}' if up_path else file_name)
        s3_filename = FilenameFunctions.get_filename_from_path(up_filename) if not from_temp_folder else up_filename
        async with cls.session.client('s3', endpoint_url=cls.aws_endpoint) as s3:
            with Path(file_name if not from_temp_folder else f'{cls.local_temp_folder}/{file_name}').open('rb') as up_file:
                await s3.upload_fileobj(up_file, bucket_name, s3_filename)

        return f's3://{bucket_name}/{s3_filename}'

    @classmethod
    async def download_from_folder(cls, folder_path: str, file_types: list, bucket_name: str = s3_bucket, local_path: str = local_temp_folder):
        def filter_file_types(s3_object, types: set):
            return s3_object.key.split('.')[-1] in types

        file_names = []
        async with cls.session.resource('s3', endpoint_url=cls.aws_endpoint) as s3:
            bucket = await s3.Bucket(bucket_name)
            async for item in bucket.objects.filter(Prefix=f'{folder_path}/'):
                if filter_file_types(item, set(file_types)):
                    file_name = item.key.split('/')[-1]
                    await cls.download_object(bucket_name, folder_path, file_name, local_path)
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