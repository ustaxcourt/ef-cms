import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

const dynamodb = new DynamoDBClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

const deleteTable = async ({ TableName }) => {
  const deleteTableCommand = new DeleteTableCommand({ TableName });
  try {
    return await dynamodb.send(deleteTableCommand);
  } catch (error) {
    // ResourceNotFoundException
    console.log('no table to delete');
    return Promise.resolve();
  }
};

const createTable = ({ TableName }) => {
  console.log('Creating EFCMS Table:', TableName);
  const createTableCommand = new CreateTableCommand({
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
    TableName,
  });
  return dynamodb.send(createTableCommand);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    await deleteTable({ TableName: 'efcms-local' });
    await deleteTable({ TableName: 'efcms-local-1' });
    await createTable({ TableName: 'efcms-local' });
    await createTable({ TableName: 'efcms-local-1' });
  } catch (err) {
    console.error(err);
  }
})();
