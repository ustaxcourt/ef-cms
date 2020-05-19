const { getDynamoDB } = require('./getDynamoDB');
const { getDynamoDBTables } = require('./getDynamoDBTables');
const { sleep } = require('./sleep');

exports.deleteDynamoDBTables = async ({ environment }) => {
  const dynamoDB = getDynamoDB({ environment });

  const tables = await getDynamoDBTables({
    dynamoDB,
    environment,
  });
  for (const table of tables) {
    console.log('Delete DynamoDB Table:', table);
    await dynamoDB.deleteTable({ TableName: table }).promise();
    await sleep(100);
  }
};
