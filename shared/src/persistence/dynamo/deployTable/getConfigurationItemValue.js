const client = require('../../dynamodbClientService');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.configurationItemKey the configuration item key to get the value for
 * @returns {object} the dynamo record
 */
exports.getConfigurationItemValue = async ({
  applicationContext,
  configurationItemKey,
}) => {
  const result = await client.getFromDeployTable({
    Key: {
      pk: configurationItemKey,
      sk: configurationItemKey,
    },
    applicationContext,
  });
  return result && result.current;
};
