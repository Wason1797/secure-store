import re
from datetime import datetime


class FilenameFunctions:

    @classmethod
    def timestamp_filename(cls, filename: str) -> str:
        timestamp = datetime.utcnow().strftime(r'%Y%m%d-%H%M%S')
        groups = cls.has_timestamp(filename)

        return f'{timestamp}_{filename}' if not groups else f'{timestamp}{groups.group(2)}'

    @staticmethod
    def replace_filename_in_path(path: str, new_filename: str) -> str:
        return '/'.join(path.split('/')[:-1]+[new_filename])

    @staticmethod
    def get_filename_from_path(path: str) -> str:
        return path.split('/')[-1]

    @classmethod
    def has_timestamp(cls, filename: str) -> str:
        pattern = re.compile(r'(\d{8}-\d{6})(.+)', re.VERBOSE)
        return pattern.search(filename)
