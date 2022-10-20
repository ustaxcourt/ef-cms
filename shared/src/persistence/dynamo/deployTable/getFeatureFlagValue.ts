import { getFromDeployTable } from '../../dynamodbClientService';

/**
 * getFeatureFlagValue
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get
 * @returns {object} the dynamo record
 */

export const getFeatureFlagValue = ({
  applicationContext,
  featureFlag,
}: {
  applicationContext: IApplicationContext;
  featureFlag: string;
}) =>
  getFromDeployTable({
    Key: {
      pk: featureFlag,
      sk: featureFlag,
    },
    applicationContext,
  });
