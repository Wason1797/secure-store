

class LocalStorage:

    storage = None

    def __init__(self):
        self.data = {
            'wbrborich@ioet.com': {
                'secrets': {
                    'AWS': 'TZ4XEvOfQho0KcdIxYDsadiZ8R6i1R5bejQBvKkp8eHix7k+A7WpErNr35hcN8eYCVgFjYEd2KlG+Ru3wTo729s1YAxPIJJfpLTaSjuApHkU9qTVJZFeKx6fKEuYxkgrc7estJz/FQUZxC4xtqrS7VPE8S3mgiCMKleiD2w8FFQ='
                },
                'public_key_path': './temp/testKey.pub'
            }
        }

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
