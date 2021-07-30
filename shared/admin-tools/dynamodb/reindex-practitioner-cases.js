// this script is to query the UserCase records for a given practitioner and
// re-index these records in case cases go missing on their dashboard
const { DynamoDB } = require('aws-sdk');
const { getVersion } = require('../util');

const environmentName = process.argv[2] || 'exp1';
const client = new DynamoDB({ region: 'us-east-1' });

const reindexItem = async ({ pk, sk }) => {
  const version = await getVersion(environmentName);
  const query = {
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
    TableName: `efcms-${environmentName}-${version}`,
    UpdateExpression: 'SET indexedTimestamp = :val1',
  };
  await client.updateItem(query).promise();
};

const reindexUserCaseRecords = async userId => {
  const version = await getVersion(environmentName);
  const query = {
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':case': { S: 'case' },
      ':pk': { S: userId },
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :case)',
    ProjectionExpression: 'pk, sk',
    TableName: `efcms-${environmentName}-${version}`,
  };

  const result = await client.query(query).promise();
  console.log(result, query);

  for (const item of result.Items) {
    const record = DynamoDB.Converter.unmarshall(item);
    await reindexItem(record);
    console.log(`  - reindexed ${record.sk}`);
  }
};

const getUserId = async barNumber => {
  const version = await getVersion(environmentName);
  const types = [
    'privatePractitioner',
    'irsPractitioner',
    'inactivePractitioner',
  ];

  for (const practitionerType of types) {
    const query = {
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': { S: `${practitionerType}|${barNumber}` },
        ':user': { S: 'user|' },
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :user)',
      TableName: `efcms-${environmentName}-${version}`,
    };
    const result = await client.query(query).promise();
    if (result.Items.length > 0) {
      return result.Items[0].sk.S;
    }
  }

  throw new Error(`Could not find practitioner with bar number ${barNumber}`);
};

const reindexBarNumber = async barNumber => {
  if (!barNumber) {
    throw new Error('we need a bar number');
  }
  const userId = await getUserId(barNumber);
  await reindexItem({ pk: userId, sk: userId });
  console.log('- user record reindexed');
  await reindexUserCaseRecords(userId);
};
(async () => {
  await reindexBarNumber(process.argv[3] || null);
})();
