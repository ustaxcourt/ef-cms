const { DynamoDB } = require('aws-sdk');

const environmentName = process.argv[2] || 'exp1';
const client = new DynamoDB({ region: 'us-east-1' });
const version = 'beta';

const getEligibleCasesForTrialSession = async ({ skPrefix }) => {
  const res = await client
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': { S: 'eligible-for-trial-case-catalog' },
        ':prefix': { S: skPrefix },
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  return res.Items.map(metadata => metadata.docketNumber.S);
};

const getCatalog = async docketNumber => {
  const res = await client
    .query({
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': { S: `eligible-for-trial-case-catalog|${docketNumber}` },
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      TableName: `efcms-${environmentName}-${version}`,
    })
    .promise();

  if (res.Items.length === 4) {
    console.log({ docketNumber });
    return res.Items;
  }
  return null;

  // return res.Items.length == 4 ? res.Items : null;
};

(async () => {
  const cases = await getEligibleCasesForTrialSession({
    skPrefix: 'NewYorkCityNewYork-S',
  });

  const results = await Promise.all(cases.map(getCatalog));

  console.log(results.filter(Boolean));
})();
