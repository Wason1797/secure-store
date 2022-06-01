from typing import Any, Callable, Iterable, List, Optional, Union

from aioboto3.dynamodb.table import TableResource
from boto3.dynamodb.conditions import Key


class BaseManager:
    model: Any = None

    class QueryResult:
        def __init__(self, dynamodb_result: dict, model: Any) -> None:
            self.__items = dynamodb_result.get('Items', [])
            self.__count = dynamodb_result.get('Count', [])
            self.__model = model

        @property
        def items(self) -> list:
            return self.__items

        @property
        def count(self) -> int:
            return self.__count

        def first(self, raw: bool = False) -> Optional[dict]:
            first_item = self.items[0] if raw else self.__model(**self.items[0])
            return first_item if self.count > 0 else None

        def all(self, raw: bool = False) -> List[dict]:
            raw_items = self.items if self.count > 0 else []
            return raw_items if raw else [self.__model(**item) for item in raw_items]

        def filter(self, predicate: Callable, raw: bool = False) -> list:
            raw_items = self.items if self.count > 0 else []
            return [item if raw else self.__model(**item) for item in raw_items if predicate(item)]

    @classmethod
    async def query_by_key(cls, db, key: str, value: str) -> QueryResult:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        result = await table.query(
            KeyConditionExpression=Key(key).eq(value)
        )
        return cls.QueryResult(result, cls.model)

    @classmethod
    async def scan(cls, db) -> QueryResult:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        result = await table.scan()
        items = result.get('Items', [])
        count = result.get('Count', 0)

        while result.get('LastEvaluatedKey', False):
            result = await table.scan(ExclusiveStartKey=result.get('LastEvaluatedKey'))
            items.extend(result.get('Items', []))
            count += result.get('Count', 0)

        return cls.QueryResult({'Items': items, 'Count': count}, cls.model)

    @classmethod
    async def put_item(cls, db, item: Union[dict, object]) -> QueryResult:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        result = await table.put_item(Item=item if isinstance(item, dict) else item.asdict())
        return cls.QueryResult(result, cls.model)

    @classmethod
    async def update_item(cls, db, key: dict, condition: dict, item: Union[dict, object]) -> QueryResult:
        def keys_to_expression(keys) -> Iterable:
            return (f'{key} = :u_{key}' for key in keys)

        table: TableResource = await db.Table(cls.model.Meta.tablename)
        item_as_dict = item if isinstance(item, dict) else item.asdict()

        update_expression = ', '.join(keys_to_expression(item_as_dict.keys()))
        condition_expression = ' AND '.join(keys_to_expression(condition.keys()))
        result = await table.update_item(
            Key=key,
            UpdateExpression=f'set {update_expression}',
            ConditionExpression=condition_expression,
            ExpressionAttributeValues={
                f':u_{key}': value for key, value in {**item_as_dict, **condition}.items()
            },
            ReturnValues='ALL_NEW'
        )
        updated_data = result.get('Attributes')
        items = ([updated_data] if isinstance(updated_data, dict) else updated_data) if updated_data else []
        return cls.QueryResult({'Items': items, 'Count': len(items)}, cls.model)
