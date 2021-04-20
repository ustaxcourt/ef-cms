const { DynamoDB } = require('aws-sdk');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const dynamodb = new DynamoDB({ region: 'us-east-1' });
const TableName = `efcms-${environmentName}-${version}`;

const getUserCases = async userId => {
  const res = await dynamodb
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': { S: `user|${userId}` },
        ':prefix': { S: 'case' },
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      ProjectionExpression: 'pk, sk',
      TableName,
    })
    .promise();

  return res.Items;
};

const reindexUserCase = async ({ pk, sk }) => {
  await dynamodb
    .updateItem({
      ExpressionAttributeValues: {
        ':val1': { N: '' + Date.now() },
      },
      Key: {
        pk: {
          S: pk,
        },
        sk: {
          S: sk,
        },
      },
      TableName,
      UpdateExpression: 'SET indexedTimestamp = :val1',
    })
    .promise();
};

(async () => {
  const records = await getUserCases('c973ada3-70dd-4cf7-9aaa-981dce4719d0');
  console.log(`Start: ${new Date()}`);
  let count = 0;
  for (const record of records) {
    await reindexUserCase({
      pk: record.pk.S,
      sk: record.sk.S,
    });
    console.log(
      `${++count} / ${records.length}: ${record.pk.S}-${record.sk.S}`,
    );
  }
  console.log(`End: ${new Date()}`);
})();
