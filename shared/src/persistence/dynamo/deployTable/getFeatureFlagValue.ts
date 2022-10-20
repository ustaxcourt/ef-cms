const client = require('../../dynamodbClientService');

/**
 * getFeatureFlagValue
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get
 * @returns {object} the dynamo record
 */

exports.getFeatureFlagValue = ({ applicationContext, featureFlag }) =>
  client.getFromDeployTable({
    Key: {
      pk: featureFlag,
      sk: featureFlag,
    },
    applicationContext,
  });
