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
    console.log('Delete ', table);
    await dynamoDB.deleteTable({ TableName: table }).promise();
    await sleep(5000);
  }

  let resourceCount = tables.length;

  while (resourceCount > 0) {
    await sleep(5000);
    const refreshedTables = await getDynamoDBTables({
      dynamoDB,
      environment,
    });
    console.log(
      'Waiting for domains to be deleted: ',
      Date(),
      refreshedTables.length,
    );
    resourceCount = refreshedTables.length;
  }
};
