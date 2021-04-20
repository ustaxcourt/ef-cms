// how to run
// node find-petitioners-missing-cases.js prod beta us-east-1_xmkXSSmnP
const AWS = require('aws-sdk');
const { get } = require('lodash');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const cognitoPoolId = process.argv[4];
const { CognitoIdentityServiceProvider } = AWS;

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

const TABLE_NAME = `efcms-${environmentName}-${version}`;
const cognito = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});
const getOpenCases = async () => {
  const esClient = await getClient({ environmentName });
  let results = await esClient.search({
    body: {
      _source: ['docketNumber', 'contactPrimary'],
      query: {
        bool: {
          must: [],
          must_not: [
            {
              term: { 'status.S': 'Closed' },
            },
          ],
        },
      },
    },
    index: 'efcms-case',
    size: 20000,
  });
  const hits = get(results, 'hits.hits');
  const formatHit = hit => {
    return {
      ...AWS.DynamoDB.Converter.unmarshall(hit['_source']),
      score: hit['_score'],
    };
  };
  if (hits && hits.length > 0) {
    results = hits.map(formatHit);
  }
  return results;
};
const isPractitionerInCognito = async email => {
  try {
    const user = await cognito
      .adminGetUser({
        UserPoolId: cognitoPoolId,
        Username: email,
      })
      .promise();
    if (
      user.UserAttributes.find(attribute => attribute.Name === 'custom:role')
        .Value === 'privatePractitioner'
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
const getPrivatePractitionersOnCase = async docketNumber => {
  return await documentClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':prefix': 'privatePractitioner',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      TableName: TABLE_NAME,
    })
    .promise()
    .then(result => result.Items);
};
(async () => {
  const allOpenCases = await getOpenCases();
  // fs.writeFileSync('./cases.json', JSON.stringify(allOpenCases));
  // const allOpenCases = JSON.parse(fs.readFileSync('./cases.json'));
  console.log(`found ${allOpenCases.length} open cases`);
  let i = 1;
  for (let openCase of allOpenCases) {
    console.log(`case ${i++} / ${allOpenCases.length}`);
    const { email } = openCase.contactPrimary;
    if (email) {
      const practitioners = await getPrivatePractitionersOnCase(
        openCase.docketNumber,
      );
      if (!practitioners.find(practitioner => practitioner.email === email)) {
        if (await isPractitionerInCognito(email)) {
          console.log(
            `found a practitioner on case ${openCase.docketNumber} that matches contactPrimary.email of ${email}`,
          );
        }
      }
    }
  }
})();
