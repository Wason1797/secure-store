import boto3

from moto import mock_s3, mock_dynamodb


@mock_s3
def create_bucket(bucket_name: str, aws_test_endpoint: str, region: str):
    s3_resource = boto3.resource('s3', endpoint_url=aws_test_endpoint, region_name=region)
    s3_resource.create_bucket(Bucket=bucket_name)


@mock_dynamodb
def create_dynamodb_table(table_name: str, key: str, aws_test_endpoint: str, region: str):
    dynamodb_resource = boto3.resource('dynamodb', endpoint_url=aws_test_endpoint, region_name=region)
    dynamodb_resource.create_table(TableName=table_name,
                                   KeySchema=[{'AttributeName': key, 'KeyType': 'HASH'}],
                                   AttributeDefinitions=[{'AttributeName': key, 'AttributeType': 'S'}],
                                   ProvisionedThroughput={
                                       'ReadCapacityUnits': 123,
                                       'WriteCapacityUnits': 123
                                   },)
