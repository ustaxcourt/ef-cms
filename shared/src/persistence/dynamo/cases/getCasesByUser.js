const client = require('../../dynamodbClientService');
const { getCaseByCaseId } = require('./getCaseByCaseId');
const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  const caseIds = (
    await client.query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues: {
        ':pk': `user|${userId}`,
        ':prefix': 'case',
      },
      KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
      applicationContext,
    })
  ).map(mapping => mapping.sk.split('|')[1]);

  const cases = await Promise.all(
    caseIds.map(caseId =>
      getCaseByCaseId({
        applicationContext,
        caseId,
      }),
    ),
  );

  return stripWorkItems(cases, applicationContext.isAuthorizedForWorkItems());
};
