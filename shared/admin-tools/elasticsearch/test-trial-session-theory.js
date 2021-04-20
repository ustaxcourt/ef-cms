const { DynamoDB } = require('aws-sdk');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const dynamodb = new DynamoDB({ region: 'us-east-1' });

const getSessions = async ExclusiveStartKey => {
  const result = await dynamodb
    .query({
      ExclusiveStartKey,
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': { S: 'trial-session-catalog' },
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  if (result.LastEvaluatedKey) {
    await getSessions(result.LastEvaluatedKey);
  } else {
    result.Items.forEach(item => {
      console.log({
        pk: item.pk,
        startDate: item.startDate,
        trialLocation: item.trialLocation,
        judge: item.judge,
      });
    });
  }

  console.log(result.Count);

  // console.log(result);

  // return DynamoDB.Converter.unmarshall(result.Item);
};

(async () => {
  await getSessions();
})();
