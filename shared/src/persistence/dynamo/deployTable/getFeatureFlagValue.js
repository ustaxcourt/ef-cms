const client = require('../../dynamodbClientService');

/**
 * getFeatureFlagValue
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get
 * @returns {boolean} the boolean of the feature flag value
 */

exports.getFeatureFlagValue = async ({ applicationContext, featureFlag }) => {
  const result = await client.getFromDeployTable({
    Key: {
      pk: featureFlag,
      sk: featureFlag,
    },
    applicationContext,
  });

  return result.current;
};
