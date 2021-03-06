
from asyncio import iscoroutinefunction
from importlib import import_module
from typing import Callable, Dict

from app.config.env_manager import EnvManager


class StartupEvents:

    @staticmethod
    def init_db_connector(connector):
        connector.init_db()

    @staticmethod
    def init_fernet_encryption(fernet):
        fernet.init_ecryption_manager(EnvManager.SERVER_SECRET, EnvManager.SERVER_SALT)

    @staticmethod
    async def init_folders(local_file_manager):
        await local_file_manager.create_folders([EnvManager.TEMP_FOLDER])

    @staticmethod
    def init_s3_storage(s3_manager):
        s3_manager.init_storage()


class StartupEventManager:

    dependencies: Dict[tuple, Callable] = {
        ('app.repositories.database.connectors', 'DynamoDBConnector'): StartupEvents.init_db_connector,
        ('app.repositories.database.connectors', 'RedisConnector'): StartupEvents.init_db_connector,
        ('app.repositories.object_storage.connectors', 'S3Connector'): StartupEvents.init_s3_storage,
        ('app.crypto.fernet_functions', 'FernetEncryption'): StartupEvents.init_fernet_encryption,
        ('app.repositories.filesystem', 'LocalFileManager'): StartupEvents.init_folders,
    }

    @staticmethod
    def load_class(dependency_path: tuple) -> object:
        module_path, dependency = dependency_path
        module = import_module(module_path)
        return getattr(module, dependency)

    @classmethod
    async def execute(cls):
        for dependency_path, startup_event in cls.dependencies.items():
            loaded_dependency = cls.load_class(dependency_path)
            if iscoroutinefunction(startup_event):
                await startup_event(loaded_dependency)
            else:
                startup_event(loaded_dependency)


async def on_startup():
    await StartupEventManager.execute()
