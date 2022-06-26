from typing import Optional
import boto3


class AWSEnvBootstrap:

    session: Optional[boto3.Session] = None
    error_template: str = 'Calling {} with empty session call init_session() first'

    @classmethod
    def init_session(cls, aws_access_key_id, aws_secret_access_key):
        if not cls.session:
            cls.session = boto3.Session(aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)

    @classmethod
    def create_bucket(cls, bucket_name: str, aws_test_endpoint: str, region: str):
        if not cls.session:
            raise ValueError(cls.error_template.format('create_bucket()'))
        s3_resource = cls.session.resource('s3', endpoint_url=aws_test_endpoint, region_name=region)
        s3_resource.create_bucket(Bucket=bucket_name)

    @classmethod
    def create_dynamodb_table(cls, table_name: str, key: str, aws_test_endpoint: str, region: str):
        if not cls.session:
            raise ValueError(cls.error_template.format('create_dynamodb_table()'))

        resource = cls.session.resource('dynamodb', endpoint_url=aws_test_endpoint, region_name=region)
        resource.create_table(TableName=table_name,
                              KeySchema=[
                                  {'AttributeName': key, 'KeyType': 'HASH'}],
                              AttributeDefinitions=[
                                  {'AttributeName': key, 'AttributeType': 'S'}],
                              ProvisionedThroughput={
                                  'ReadCapacityUnits': 123,
                                  'WriteCapacityUnits': 123
                              })
