const client = require('../../dynamodbClientService');

/**
 * deleteByGsi
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.gsi the gsi to search and delete
 * @returns {Promise} the promise of the call to persistence
 */
exports.deleteByGsi = async ({ applicationContext, gsi }) => {
  const items = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': gsi,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  await Promise.all(
    items.map(item =>
      client.delete({
        applicationContext,
        key: {
          pk: item.pk,
          sk: item.sk,
        },
      }),
    ),
  );
};
