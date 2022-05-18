

class FileTypeNotAllowedException(Exception):
    def __init__(self, body_response: dict, *args) -> None:
        super().__init__(*args)
        self.body_response = body_response


class MaxFileSizeException(Exception):
    def __init__(self, body_response: dict, *args) -> None:
        super().__init__(*args)
        self.body_response = body_response
