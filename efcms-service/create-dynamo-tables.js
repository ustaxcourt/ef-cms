const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
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
    return Promise.resolve();
  }
};

const createEFCMSTable = async () => {
  await deleteTable('efcms-local');
  console.log('Creating EFCMS Table');
  return dynamo
    .createTable({
      TableName: 'efcms-local',
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
      AttributeDefinitions: [
        {
          AttributeName: 'pk',
          AttributeType: 'S',
        },
        {
          AttributeName: 'sk',
          AttributeType: 'S',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    })
    .promise();
};

(async () => {
  await createEFCMSTable();
})();
