
from asyncio import iscoroutinefunction
from importlib import import_module
from typing import Callable, Dict


class StartupEvents:

    @staticmethod
    def init_db_connector(connector):
        connector.init_db()


class StartupEventManager:

    dependencies: Dict[tuple, Callable] = {
        ('app.repositories.database.connectors', 'DynamoDBConnector'): StartupEvents.init_db_connector,
        ('app.repositories.database.connectors', 'RedisConnector'): StartupEvents.init_db_connector
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
