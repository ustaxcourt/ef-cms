// how to run
// node find-petitioners-missing-cases.js mig alpha https://search-efcms-search-mig-alpha-dwffrub5hv5f4w4vlxpt4v65ni.us-east-1.es.amazonaws.com

const AWS = require('aws-sdk');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
const { Client } = require('@opensearch-project/opensearch');
const { get } = require('lodash');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const openSearchEndpoint = process.argv[4];
const TABLE_NAME = `efcms-${environmentName}-${version}`;

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

const esClient = new Client({
  ...AwsSigv4Signer({
    getCredentials: () =>
      new Promise((resolve, reject) => {
        AWS.config.getCredentials((err, credentials) => {
          if (err) {
            reject(err);
          } else {
            resolve(credentials);
          }
        });
      }),

    region: 'us-east-1',
  }),
  node: `https://${openSearchEndpoint}:443`,
});

const getOpenCases = async () => {
  let results = await esClient.search({
    body: {
      _source: ['docketNumber', 'petitioners'],
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

// const isPractitionerInCognito = async email => {
//   try {
//     const user = await cognito
//       .adminGetUser({
//         UserPoolId: cognitoPoolId,
//         Username: email,
//       })
//       .promise();
//     if (
//       user.UserAttributes.find(attribute => attribute.Name === 'custom:role')
//         .Value === 'privatePractitioner'
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     return false;
//   }
// };

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

  console.log(`found ${allOpenCases.length} open cases`);
  let i = 1;

  for (let openCase of allOpenCases) {
    console.log(`case ${i++} / ${allOpenCases.length}`);
    const { email } = openCase.petitioners.find(
      p => p.contactType === 'primary',
    );
    if (email) {
      const practitioners = await getPrivatePractitionersOnCase(
        openCase.docketNumber,
      );
      if (practitioners.find(practitioner => practitioner.email === email)) {
        console.log(
          `found a practitioner on case ${openCase.docketNumber} that matches contactPrimary.email of ${email}`,
        );
      }
      // const isEmailActuallyAPractitionerEmail = await isPractitionerInCognito(
      //   email,
      // );
      // if (isEmailActuallyAPractitionerEmail) {
      //   console.log(
      //     `case of ${openCase.docketNumber} is bad: ${email} should be removed from contactPrimary`,
      //   );
      // }
    }
  }
})();
