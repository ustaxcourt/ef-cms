// how to run
// node find-cases-missing-practitioners.js mig alpha

const AWS = require('aws-sdk');
const { searchAll } = require('../../../web-api/elasticsearch/searchAll');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';
const esClientArgs = { environmentName, version };

const documentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'dynamodb.us-east-1.amazonaws.com',
  region: 'us-east-1',
});
const dynamoTableName = `efcms-${environmentName}-${version}`;

/**
 * Get active practitioners' user pks
 *
 * @param {string} practitionerType either 'privatePractitioner' or 'irsPractitioner'
 * @returns {Promise<Array<String>>} array of user pks
 */
const getActivePractitionerUserPks = async practitionerType => {
  const query = {
    bool: {
      must: [
        {
          term: {
            'role.S': {
              value: practitionerType,
            },
          },
        },
        {
          term: {
            'admissionsStatus.S': {
              value: 'Active',
            },
          },
        },
      ],
    },
  };

  const hits = await searchAll(
    esClientArgs,
    'efcms-user',
    query,
    [{ 'pk.S': 'asc' }],
    ['pk.S'],
  );

  // eslint-disable-next-line no-underscore-dangle
  return hits.map(hit => hit._source.pk.S);
};

/**
 * Get a user's active cases
 *
 * @param {string} userPk user's pk
 * @returns {Promise<Array<Object>>} array of UserCase entities
 */
const getUserCases = async userPk => {
  return await documentClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':pk': userPk,
        ':prefix': 'case',
        ':status': 'Closed',
      },
      FilterExpression: '#status <> :status',
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      TableName: dynamoTableName,
    })
    .promise()
    .then(result => result.Items);
};

// const getActivePractitionersActiveCases = async practitionerType => {
//   const userPks = await getActivePractitionerUserPks(practitionerType);
//   console.log(`found ${userPks.length} active ${practitionerType}s`);
//
//   if (userPks.length > 0) {
//     const query = {
//       bool: {
//         must: [
//           {
//             term: {
//               'pk.S': {
//                 value: userPks,
//               },
//             },
//           },
//         ],
//         must_not: [
//           {
//             term: {
//               'status.S': {
//                 value: 'Closed',
//               },
//             },
//           },
//         ],
//       },
//       prefix: {
//         'sk.S': {
//           value: 'case|',
//         },
//       },
//     };
//
//     const hits = await searchAll(esClientArgs, 'efcms-case', query);
//
//     // eslint-disable-next-line no-underscore-dangle
//     return hits.map(hit => hit._source);
//   }
// };

/**
 * Get a private or IRS practitioner entity with the provided docket number and user uuid
 *
 * @param {string} docketNumber docket number
 * @param {string} practitionerType either 'privatePractitioner' or 'irsPractitioner'
 * @param {string} userId user uuid
 * @returns {Promise<Array<Object>>>} array of PrivatePractitioner entities
 */
const practitionerEntityInCasePartition = async (
  docketNumber,
  practitionerType,
  userId,
) => {
  return await documentClient
    .query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
        ':sk': `${practitionerType}|${userId}`,
      },
      KeyConditionExpression: '#pk = :pk and #sk = :sk',
      TableName: dynamoTableName,
    })
    .promise()
    .then(result => result.Items);
};

(async () => {
  let toFix = [];

  for (let practitionerType of ['irsPractitioner', 'privatePractitioner']) {
    const activePractitioners = await getActivePractitionerUserPks(
      practitionerType,
    );
    console.log(
      `found ${activePractitioners.length} active ${practitionerType}s`,
    );

    let i = 1;
    for (let userPk of activePractitioners) {
      const userId = userPk.replace('user|', '');
      console.log(
        `-${practitionerType} ${i++} / ${activePractitioners.length}`,
      );
      const userCases = await getUserCases(userPk);
      console.log(`--associated to ${userCases.length} active cases`);
      if (userCases.length > 0) {
        for (let userCase of userCases) {
          const isAssignedToCase = await practitionerEntityInCasePartition(
            userCase.docketNumber,
            practitionerType,
            userId,
          );
          if (isAssignedToCase.length === 0) {
            const entityName =
              practitionerType.charAt(0).toUpperCase() +
              practitionerType.slice(1);
            toFix.push({
              entityName,
              pk: userCase.sk,
              sk: `${practitionerType}|${userId}`,
              userId,
            });
            console.log(
              `---Missing ${entityName} entity for ${userCase.sk} and ${practitionerType}|${userId}`,
            );
          }
        }
      }
    }
  }

  // TODO: if we index UserCase entities in es, we can do this instead:
  // let toFix = [];
  // for (let practitionerType of ['irsPractitioner', 'privatePractitioner']) {
  //   const activeCases = await getActivePractitionersActiveCases(practitionerType);
  //   if (activeCases.length > 0) {
  //     for (let userCase of activeCases) {
  //       const userId = userCase.pk.S.replace('user|', '');
  //       const isAssignedToCase = await practitionerEntityInCasePartition(
  //         userCase.docketNumber,
  //         practitionerType,
  //         userId,
  //       );
  //       if (isAssignedToCase.length === 0) {
  //         const entityName =
  //           practitionerType.charAt(0).toUpperCase() +
  //           practitionerType.slice(1);
  //         toFix.push({
  //           entityName,
  //           pk: userCase.pk.S,
  //           sk: `${practitionerType}|${userId}`,
  //           userId,
  //         });
  //         console.log(`-Missing ${entityName} entity for ${userCase.sk.S} and ${practitionerType}|${userId}`);
  //       }
  //     }
  //   }
  // }

  console.log(toFix);
})();
