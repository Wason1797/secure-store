import boto3

from moto import mock_s3


@mock_s3
def create_bucket(bucket_name: str, aws_test_endpoint: str, region: str):
    s3_resource = boto3.resource('s3', endpoint_url=aws_test_endpoint, region_name=region)
    s3_resource.create_bucket(Bucket=bucket_name)
