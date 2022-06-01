from dataclasses import dataclass


@dataclass
class Secret:

    recipient_sub: str
    recipient_email: str
    recipient_email: str
    created_at: int
    secret_identifier: str
    secret: str
    sender_sub: str
    sender_email: str

    class Meta:
        tablename: str = 'secrets'