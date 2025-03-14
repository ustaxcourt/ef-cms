import {
  ServerApplicationContext,
  applicationContext,
} from './applicationContext';
import {
  getConnectionIdFromEvent,
  getUserFromAuthHeader,
  handle,
} from './middleware/apiGatewayHelper';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { getMaintenanceMode } from '@web-api/persistence/dynamo/deployTable/getMaintenanceMode';

export const checkMaintenanceMode = async () => {
  const maintenanceRecord = await getMaintenanceMode({ applicationContext });

  const maintenanceMode = !!(maintenanceRecord && maintenanceRecord.current);

  if (maintenanceMode) {
    throw new Error('Maintenance mode is enabled');
  }

  return maintenanceMode;
};

/**
 * generic handler function for use in lambdas
 *
 * @param {object} awsEvent the AWS event object
 * @param {Function} cb the code to be executed
 * @param options
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const genericHandler = (
  awsEvent,
  cb: (params: {
    applicationContext: ServerApplicationContext;
    clientConnectionId?: string;
  }) => any,
  options: {
    bypassMaintenanceCheck?: boolean;
    logResults?: boolean;
  } = {},
) => {
  return handle(awsEvent, async () => {
    const user = getUserFromAuthHeader(awsEvent);
    const clientConnectionId = getConnectionIdFromEvent(awsEvent);
    getLogger().addUser({ user });

    delete awsEvent.logger;

    try {
      getLogger().debug('Request:', {
        request: awsEvent,
        user,
      });

      const { bypassMaintenanceCheck } = options;

      if (!bypassMaintenanceCheck) {
        await checkMaintenanceMode();
      }

      const results = await cb({
        applicationContext,
        clientConnectionId,
      });

      if (options.logResults !== false) {
        getLogger().debug('Results:', {
          results,
        });
      }

      return results;
    } catch (e) {
      if (!e.skipLogging) {
        // we don't want email alerts to be sent out just because someone searched for a non-existing case
        getLogger().error(e);
      }
      throw e;
    }
  });
};
