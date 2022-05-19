import aioboto3
from app.config.env_manager import EnvManager
from pathlib import Path


class S3Manager:

    session = aioboto3.Session(aws_access_key_id=EnvManager.AWS_ACCESS_KEY_ID,
                               aws_secret_access_key=EnvManager.AWS_SECRET_ACCESS_KEY)

    @classmethod
    async def download_object(cls, bucket_name: str, path: str, file_name: str, local_path: str = EnvManager.TEMP_FOLDER, chunk_size: int = 69 * 1024):
        local_filename = f'{local_path}/{file_name}'
        async with cls.session.client('s3') as s3:
            s3object = await s3.get_object(Bucket=bucket_name, Key=f'{path}/{file_name}')

            async with s3object['Body'] as stream:
                data = await stream.read(chunk_size)
                with open(local_filename, 'wb') as f:
                    while data:
                        f.write(data)
                        data = await stream.read(chunk_size)
        return local_filename

    @classmethod
    async def upload_object(cls, bucket_name: str, up_path: str, file_name: str, up_filename: str = '', local_path: str = EnvManager.TEMP_FOLDER):
        up_filename = up_filename or file_name
        async with cls.session.client('s3') as s3:
            with Path(f'{local_path}/{file_name}').open('rb') as up_file:
                await s3.upload_fileobj(up_file, bucket_name, f'{up_path}/{up_filename}')

        return f's3://{bucket_name}/{up_path}/{up_filename}'

    @classmethod
    async def download_from_folder(cls, bucket_name: str, folder_path: str, file_types: list, local_path: str = EnvManager.TEMP_FOLDER):
        def filter_file_types(s3_object, types: set):
            return s3_object.key.split('.')[-1] in types

        file_names = []
        async with cls.session.resource('s3') as s3:
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
