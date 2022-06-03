

class LocalStorage:

    storage = None

    def __init__(self):
        self.data = {}

    def get_data(self):
        return self.data

    def set_data(self, key: str, value: dict) -> None:
        self.data[key] = value

    def update_data(self, key: str, value: dict) -> None:
        self.data[key] = dict(**self.data[key], **value)

    @classmethod
    def get_storage(cls) -> 'LocalStorage':
        cls.init_storage()
        return cls.storage

    @classmethod
    def init_storage(cls):
        if cls.storage is None:
            cls.storage = LocalStorage()
