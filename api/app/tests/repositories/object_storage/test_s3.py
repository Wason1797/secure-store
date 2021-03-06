import aiofiles
import pytest
from app.repositories.object_storage.managers import S3Manager


@pytest.fixture
def test_file_name_and_contents():
    return 'test_file.pub', 'this is a temp file'


@pytest.fixture
async def test_file(test_temp_folder, test_file_name_and_contents):
    file_name, contents = test_file_name_and_contents
    test_file_path = test_temp_folder/file_name
    async with aiofiles.open(test_file_path, 'w') as temp_file:
        await temp_file.write(contents)

    return str(test_file_path.resolve())


@pytest.fixture
async def s3_object_path(s3_storage_session,  test_file):
    return await S3Manager.upload_object(s3_storage_session, test_file)


@pytest.mark.anyio
async def test_download_object(s3_storage_session, s3_object_path, test_temp_folder, test_file_name_and_contents):
    local_path = await S3Manager.download_object(s3_storage_session, s3_object_path, str(test_temp_folder/'download.pub'))
    _, test_file_contents = test_file_name_and_contents
    async with aiofiles.open(local_path) as test_file:
        downloaded_contents = await test_file.read()

    assert downloaded_contents == test_file_contents


@pytest.mark.anyio
async def test_upload_object(s3_object_path):
    assert s3_object_path


@pytest.mark.anyio
async def test_upload_object_with_rename(s3_storage_session,  test_file):
    new_name = 'test_file_updated.pub'
    upload_path = await S3Manager.upload_object(s3_storage_session, test_file, up_filename=new_name)
    assert upload_path
    assert new_name in upload_path


@pytest.mark.anyio
async def test_download_from_folder(s3_storage_session):
    pass


@pytest.mark.parametrize(['s3_path', 'expected'], [
    ('s3://bucket-name/filename.txt', ('bucket-name', 'filename.txt', '')),
    ('s3://bucket-name/folder/filename.txt', ('bucket-name', 'filename.txt', 'folder')),
    ('s3://bucket-name/folder/subfolder/filename.txt', ('bucket-name', 'filename.txt', 'folder/subfolder')),
    ('c:/bucket-name/folder/subfolder/filename.txt', ('', '', '')),
])
def test_get_bucket_path_name_split(s3_path, expected):
    path_split = S3Manager.get_bucket_path_name_split(s3_path)
    assert path_split == expected
