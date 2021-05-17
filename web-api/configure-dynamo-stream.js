const { DynamoDB } = require('aws-sdk');

const tableName = process.argv[2];
const enabled = process.argv[3] == 'true';

const dynamodb = new DynamoDB({ region: 'us-east-1' });
const params = {
  StreamSpecification: {
    StreamEnabled: enabled,
  },
  TableName: tableName,
};

dynamodb.updateTable(params, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log(`DynamoDB stream disabled for table ${tableName}`, data);
  }
});
