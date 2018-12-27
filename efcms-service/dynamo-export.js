const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
});

documentClient.scan({
  TableName: 'efcms-local'
}).promise().then(documents => {
  console.log(JSON.stringify(documents.Items, null, 2));
});