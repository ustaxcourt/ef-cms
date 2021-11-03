const client = require('../../dynamodbClientService');

/**
 * getExternalOrderSearchEnabled
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<string>} the value of the external-internal-order-search-enabled  flag on the dynamodb deploy table
 */
exports.getExternalOrderSearchEnabled = async ({ applicationContext }) => {
  const result = await client.getFromDeployTable({
    Key: {
      pk: 'external-internal-order-search-enabled ',
      sk: 'external-internal-order-search-enabled ',
    },
    applicationContext,
  });

  return result.current;
};
