const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
  region: 'us-east-1',
});

const deleteTable = async tableName => {
  try {
    return await dynamo
      .deleteTable({
        TableName: tableName,
      })
      .promise();
  } catch (error) {
    // ResourceNotFoundException
    console.log('no table to delete');
    return Promise.resolve();
  }
};

const createEFCMSTable = async tableName => {
  console.log(`Creating EFCMS Table: ${tableName}`);
  return dynamo
    .createTable({
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'sk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gsi1pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'gsi2pk',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            {
              AttributeName: 'gsi1pk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'pk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
        {
          IndexName: 'gsi2',
          KeySchema: [
            {
              AttributeName: 'gsi2pk',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'sk',
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      KeySchema: [
        {
          AttributeName: 'pk',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'sk',
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      StreamSpecification: {
        StreamEnabled: true,
        StreamViewType: 'NEW_AND_OLD_IMAGES',
      },
      TableName: tableName,
    })
    .promise();
};

(async () => {
  try {
    await deleteTable('efcms-local');
    await deleteTable('efcms-local-1');
    await createEFCMSTable('efcms-local');
    await createEFCMSTable('efcms-local-1');
  } catch (err) {
    console.error(err);
  }
})();
