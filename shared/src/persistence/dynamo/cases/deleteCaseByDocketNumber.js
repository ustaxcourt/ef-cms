const client = require('../../dynamodbClientService');

/**
 * deleteCaseByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the case being deleted
 * @returns {object} the case data
 */
exports.deleteCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const recordsToDelete = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const [results] = await Promise.all(
    recordsToDelete.map(({ sk }) =>
      client.delete({
        applicationContext,
        key: {
          pk: `case|${docketNumber}`,
          sk,
        },
      }),
    ),
  );

  return results;
};
