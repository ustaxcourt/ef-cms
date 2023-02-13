const AWS = require('aws-sdk');

const tableName = process.argv[2] ?? 'efcms-local';

if (!tableName) {
  console.error('Table name to export is required');
  process.exit(1);
}

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

documentClient
  .scan({
    TableName: tableName,
  })
  .promise()
  .then(documents => {
    documents.Items.sort((a, b) => {
      return `${a.pk}-${a.sk}`.localeCompare(`${b.pk}-${b.sk}`);
    });
    console.log(JSON.stringify(documents.Items, null, 2));
  });
