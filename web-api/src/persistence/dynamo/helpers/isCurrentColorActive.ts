import { getFromDeployTable } from '../../dynamodbClientService';

/**
 * Checks to see if the environment currentColor matches that of the deploy table
 *
 * @param {object} applicationContext The applicationContext
 * @returns {Promise} which resolves to whether or not the current color matches what's in the deploy table
 */
export const isCurrentColorActive = async (
  applicationContext: IApplicationContext,
) => {
  const { current: currentColor } = await getFromDeployTable({
    Key: {
      pk: 'current-color',
      sk: 'current-color',
    },
    applicationContext,
  });

  return process.env.CURRENT_COLOR === currentColor;
};
