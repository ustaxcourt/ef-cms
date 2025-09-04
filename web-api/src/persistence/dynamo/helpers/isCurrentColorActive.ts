import { ServerApplicationContext } from '@web-api/applicationContext';
import { getSsmParameter } from '@web-api/persistence/ssm/ssmClientService';

/**
 * Checks to see if the environment currentColor matches that of the deploy table
 *
 * @param {object} applicationContext The applicationContext
 * @returns {Promise} which resolves to whether or not the current color matches what's in the deploy table
 */
export const isCurrentColorActive = async (
  applicationContext: ServerApplicationContext,
) => {
  const currentColor = await getSsmParameter({
    applicationContext,
    parameterName: 'current-color',
  });
  return process.env.CURRENT_COLOR === currentColor;
};
