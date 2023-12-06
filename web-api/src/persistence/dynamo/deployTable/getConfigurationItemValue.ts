import { getFromDeployTable } from '../../dynamodbClientService';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.configurationItemKey the configuration item key to get the value for
 * @returns {object} the dynamo record
 */
export const getConfigurationItemValue = async ({
  applicationContext,
  configurationItemKey,
}: {
  applicationContext: IApplicationContext;
  configurationItemKey: string;
}) => {
  const result = await getFromDeployTable({
    Key: {
      pk: configurationItemKey,
      sk: configurationItemKey,
    },
    applicationContext,
  });
  return result && result.current;
};
