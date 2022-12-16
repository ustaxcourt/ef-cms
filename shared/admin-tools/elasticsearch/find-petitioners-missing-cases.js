// how to run
// node find-petitioners-missing-cases.js mig alpha https://search-efcms-search-mig-alpha-dwffrub5hv5f4w4vlxpt4v65ni.us-east-1.es.amazonaws.com

const AWS = require('aws-sdk');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
const { chunk } = require('lodash');
const { Client } = require('@opensearch-project/opensearch');
const { get } = require('lodash');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const openSearchEndpoint = process.argv[4];

const CHUNK_SIZE = 100;

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});

const openSearchClient = new Client({
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

const TABLE_NAME = `efcms-${environmentName}-${version}`;

const queryForPetitioners = async () => {
  let results = await openSearchClient.search({
    body: {
      query: {
        bool: {
          must: [
            {
              terms: {
                'role.S': ['petitioner'],
              },
            },
          ],
        },
      },
    },
    index: 'efcms-user',
    size: 10000,
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

const checkUser = async user => {
  const userCases = await documentClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `user|${user.userId}`,
        ':prefix': 'case',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      TableName: TABLE_NAME,
    })
    .promise()
    .then(result => result.Items);

  await Promise.all(
    userCases.map(async theUserCase => {
      const theCase = await documentClient
        .get({
          Key: {
            pk: `case|${theUserCase.docketNumber}`,
            sk: `case|${theUserCase.docketNumber}`,
          },
          TableName: TABLE_NAME,
        })
        .promise()
        .then(({ Item }) => Item);

      if (theCase.petitioners) {
        const found = theCase.petitioners.find(
          petitioner => petitioner.contactId === user.userId,
        );
        if (!found) {
          console.log(
            `ERROR: user ${user.userId} is associated with ${theCase.docketNumber}, but does not exist on the petitioners array`,
          );
        }
      } else {
        if (
          user.userId !== theCase.contactPrimary?.contactId &&
          user.userId !== theCase.contactSecondary?.contactId
        ) {
          console.log(
            `ERROR: user ${user.userId} is associated with ${theCase.docketNumber}, but does not exist on the contactPrimary / contactSecondary`,
          );
        }
      }
    }),
  );
};

(async () => {
  const users = await queryForPetitioners();

  const userChunks = chunk(users, CHUNK_SIZE);
  let i = 1;
  console.log(
    `processing ${userChunks.length} chunks of users with each chunk being ${CHUNK_SIZE}`,
  );
  for (let userChunk of userChunks) {
    console.log(`processing chunk ${i++} of ${userChunks.length}`);
    await Promise.all(userChunk.map(checkUser));
  }
})();
