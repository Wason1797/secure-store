from typing import Any, Iterable, Union

from aioboto3.dynamodb.table import TableResource
from boto3.dynamodb.conditions import Key
from dataclasses import asdict


class BaseManager:
    model: Any = None

    @classmethod
    async def get_items(cls, db, key: str, value: str) -> dict:
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        result = await table.query(
            KeyConditionExpression=Key(key).eq(value)
        )
        return result.get('Items') if result.get('Count') > 0 else None

    @classmethod
    async def put_item(cls, db, item: Union[dict, object]):
        table: TableResource = await db.Table(cls.model.Meta.tablename)
        result = await table.put_item(Item=item if isinstance(item, dict) else asdict(item))
        return result

    @classmethod
    async def update_item(cls, db, key: dict, condition: dict, item: Union[dict, object]):
        def keys_to_expression(keys) -> Iterable:
            return (f'{key} = :u_{key}' for key in keys)

        table: TableResource = await db.Table(cls.model.Meta.tablename)
        item_as_dict = item if isinstance(item, dict) else asdict(item)

        update_expression = ', '.join(keys_to_expression(item_as_dict.keys()))
        condition_expression = 'AND '.join(keys_to_expression(condition.keys()))
        result = await table.update_item(
            Key=key,
            UpdateExpression=f'set {update_expression}',
            ConditionExpression=condition_expression,
            ExpressionAttributeValues={
                f':u_{key}': value for key, value in {**item_as_dict, **condition_expression}
            },
            ReturnValues="UPDATED_NEW"
        )
        return result
