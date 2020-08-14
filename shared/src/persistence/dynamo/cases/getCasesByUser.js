const client = require('../../dynamodbClientService');
const { getCaseByDocketNumber } = require('./getCaseByDocketNumber');

exports.getCasesByUser = async ({ applicationContext, userId }) => {
  const docketNumbers = (
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
    docketNumbers.map(docketNumber =>
      getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  return cases;
};
