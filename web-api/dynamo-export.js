const AWS = require('aws-sdk');
const { scanFull } = require('./utilities/scanFull');

const tableName = process.argv[2] ?? 'efcms-local';

if (!tableName) {
  console.error('Table name to export is required');
  process.exit(1);
}

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

scanFull(tableName, documentClient).then(documents => {
  documents.sort((a, b) => {
    return `${a.pk}-${a.sk}`.localeCompare(`${b.pk}-${b.sk}`);
  });
  console.log(JSON.stringify(documents, null, 2));
});
