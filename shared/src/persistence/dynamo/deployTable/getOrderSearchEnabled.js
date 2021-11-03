const client = require('../../dynamodbClientService');

/**
 * getOrderSearchEnabled
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<string>} the value of the internal-order-search-enabled  flag on the dynamodb deploy table
 */
exports.getOrderSearchEnabled = async ({ applicationContext }) => {
  const result = await client.getFromDeployTable({
    Key: {
      pk: 'internal-order-search-enabled ',
      sk: 'internal-order-search-enabled ',
    },
    applicationContext,
  });

  return result.current;
};
