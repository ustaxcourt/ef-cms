const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB({
  endpoint: 'http://localhost:8000',
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
    console.log('no table to delete')
    return Promise.resolve();
  }
};

const createEFCMSTable = async () => {
  await deleteTable('efcms-local');
  console.log('Creating EFCMS Table');
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
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'gsi1',
          KeySchema: [
            {
              AttributeName: 'gsi1pk',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'pk',
              KeyType: 'RANGE'
            }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
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
      TableName: 'efcms-local',
    })
    .promise();
};

(async () => {
  try {
    const table = await createEFCMSTable();
    console.log(table);
  } catch (err) {
    console.error(err);
  }
})();
