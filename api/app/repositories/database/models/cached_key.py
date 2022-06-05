from dataclasses import dataclass, asdict


@dataclass
class CachedKey:

    user_sub: str
    derived_key: str

    def asdict(self) -> dict:
        return asdict(self)

    class Meta:
        tablename: str = 'secrets'
