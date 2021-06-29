# flake8: noqa

import sys
from hashlib import md5
from awsglue.transforms import Map
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job


## @params: [JOB_NAME]
args = getResolvedOptions(
    sys.argv,
    ['JOB_NAME',
     'destination_table',
     'source_table',
     'number_of_workers',
     'external_role_arn'
     ]
)

FAKE_DOMAIN = 'mig.ef-cms.ustaxcourt.gov'

# Options for DynamoDB connections here:
# https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-connect.html

OUTPUT_OPTIONS = {
    "dynamodb.output.tableName": args['destination_table'],
    "dynamodb.output.retry": 35,
    "dynamodb.throughput.write.percent": 0.1,
    "dynamodb.sts.roleArn": args['external_role_arn'],
    "dynamodb.region": "us-east-1"
}

# Per: https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-connect.html#aws-glue-programming-etl-connect-dynamodb
# with g1.x worker type
dynamo_splits = ((int(args['number_of_workers']) - 1) * 2 - 1) * 8

INPUT_OPTIONS = {
    "dynamodb.input.tableName": args['source_table'],
    "dynamodb.splits": str(dynamo_splits),
    "dynamodb.region": "us-east-1"
}


def mock_email(email, domain):
    return md5(email.encode()).hexdigest() + '@' + domain


def find_and_mock_emails(record):
    '''
    Recursively find all keys in dictionaries named 'email' and mock these values.
    This changes the record in-place.
    '''
    if isinstance(record, dict):
        for k, v in record.items():
            if k == 'email':
                record[k] = mock_email(v, FAKE_DOMAIN)
            else:
                find_and_mock_emails(v)
    if isinstance(record, list):
        for item in record:
            find_and_mock_emails(item)


def mock_user_email_key(record):
    '''
    Handle records with pk in the form of `user-email|somebody@example.com`
    This changes the record in-place.
    '''
    record_type, data = record['pk'].split('|', 1)
    if record_type == 'user-email':
        mocked_email = mock_email(data, FAKE_DOMAIN)
        record['pk'] = f"{record_type}|{mocked_email}"


sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)


## @type: DataSource
## @args: [connection_type="dynamodb", connection_options={"dynamodb.input.tableName": "source_table"}, transformation_ctx="datasource0"]
## @return: datasource0
## @inputs: []
datasource0 = glueContext.create_dynamic_frame.from_options(
    connection_type='dynamodb',
    connection_options=INPUT_OPTIONS,
    transformation_ctx='datasource0'
)


## @type: Map
## @args: [f = map_function, transformation_ctx = "mapped"]
## @return: mapped
## @inputs: [frame = datasource0]
def map_function(dynamicRecord):
    if dynamicRecord['pk'].startswith('user-email|'):
        mock_user_email_key(dynamicRecord)

    find_and_mock_emails(dynamicRecord)
    return dynamicRecord


mapped = Map.apply(frame=datasource0, f=map_function, transformation_ctx='mapped')


## @type: DataSink
## @args: [connection_type="dynamodb", connection_options={"table_name": "destination_table"} ]
## @return: datasink0
## @inputs: [frame = mapped]
datasink0 = glueContext.write_dynamic_frame.from_options(
    frame=mapped,
    connection_type="dynamodb",
    connection_options=OUTPUT_OPTIONS,
    transformation_ctx='datasink0'
)

job.commit()
