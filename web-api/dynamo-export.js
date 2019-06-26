const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

documentClient
  .scan({
    TableName: 'efcms-local',
  })
  .promise()
  .then(documents => {
    console.log(JSON.stringify(documents.Items, null, 2));
  });
