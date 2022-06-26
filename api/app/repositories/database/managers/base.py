from typing import Any, Callable, Iterable, List, Optional, Union

from aioboto3.dynamodb.table import TableResource
from boto3.dynamodb.conditions import Key, And
from functools import reduce


class BaseManager:
    model: Any = None

    class QueryResult:
        def __init__(self, dynamodb_result: dict, model: Any) -> None:
            self.__items = dynamodb_result.get('Items', [])
            self.__count = dynamodb_result.get('Count', 0)
            self.__model = model

        @property
        def items(self) -> list:
            return self.__items

        @property
        def count(self) -> int:
            return self.__count

        def first(self, raw: bool = False) -> Optional[dict]:
            first_item = self.items[0] if self.count > 0 else None
            return first_item if raw else (self.__model(**first_item) if first_item else None)

        def all(self, raw: bool = False) -> List[dict]:
            raw_items = self.items if self.count > 0 else []
            return raw_items if raw else [self.__model(**item) for item in raw_items]

        def filter(self, predicate: Callable, raw: bool = False) -> list:
            raw_items = self.items if self.count > 0 else []
            return [item if raw else self.__model(**item) for item in raw_items if predicate(item)]

    @staticmethod
    def __parse_model(item: Union[dict, object]) -> dict:
        return item if isinstance(item, dict) else item.asdict()

    @classmethod
    async def query_by_primary_key(cls, db, key: str, value: str) -> QueryResult:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        result = await table.query(
            KeyConditionExpression=Key(key).eq(value)
        )
        return cls.QueryResult(result, cls.model)

    @classmethod
    async def scan(cls, db, filters: Optional[dict] = None) -> QueryResult:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        filter_expression = reduce(And, ([Key(key).eq(value) for key, value in filters.items()])) if filters else None
        scan_coro = table.scan(FilterExpression=filter_expression) if filter_expression else table.scan()
        result = await scan_coro
        items, count = result.get('Items', []), result.get('Count', 0)

        while result.get('LastEvaluatedKey', False):
            scan_coro = table.scan(ExclusiveStartKey=result.get('LastEvaluatedKey'), FilterExpression=filter_expression) \
                if filter_expression else table.scan(ExclusiveStartKey=result.get('LastEvaluatedKey'))
            result = await scan_coro
            items.extend(result.get('Items', []))
            count += result.get('Count', 0)

        return cls.QueryResult({'Items': items, 'Count': count}, cls.model)

    @classmethod
    async def put_item(cls, db, item: Union[dict, object]) -> QueryResult:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        result = await table.put_item(Item=cls.__parse_model(item))
        status_code = result.get('ResponseMetadata', {}).get('HTTPStatusCode')
        items, count = ([item], 1) if status_code == 200 and 'Items' not in result else \
            (result.get('Items'), result.get('Count')) if 'Items' in result else ([], 0)

        return cls.QueryResult({'Items': items, 'Count': count}, cls.model)

    @classmethod
    async def batch_write(cls, db, items: List[Union[dict, object]]) -> QueryResult:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        async with table.batch_writer() as writer:
            for item in items:
                await writer.put_item(Item=cls.__parse_model(item))

        return cls.QueryResult({'Items': items, 'Count': len(items)}, cls.model)

    @classmethod
    async def update_item(cls, db, key: dict, condition: dict, item: Union[dict, object]) -> QueryResult:
        def keys_to_expression(keys) -> Iterable:
            return (f'{key} = :u_{key}' for key in keys)

        table: TableResource = await db.Table(cls.model.Meta.tablename)
        item_as_dict = cls.__parse_model(item)

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
