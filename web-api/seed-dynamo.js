const AWS = require('aws-sdk');
const seedEntries = require('./storage/fixtures/seed');

const client = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
})

const main = async () => {
  for (const item of seedEntries) {
    await client.put({
      Item: item,
      TableName: 'efcms-local'
    }).promise();
  }
}

main();
