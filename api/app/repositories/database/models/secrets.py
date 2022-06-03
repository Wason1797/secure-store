from dataclasses import dataclass, asdict


@dataclass
class Secret:

    secret_id: str
    recipient_sub: str
    recipient_email: str
    created_at: int
    secret: str
    sender_sub: str
    sender_email: str

    def asdict(self) -> dict:
        return asdict(self)

    class Meta:
        tablename: str = 'secrets'
