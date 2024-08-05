import {
  ServerApplicationContext,
  createApplicationContext,
} from './applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  getConnectionIdFromEvent,
  getUserFromAuthHeader,
  handle,
} from './middleware/apiGatewayHelper';

export const dataSecurityFilter = (
  data,
  {
    applicationContext,
    authorizedUser,
  }: {
    applicationContext: ServerApplicationContext;
    authorizedUser: UnknownAuthUser;
  },
) => {
  let returnData = data;
  if (data && Array.isArray(data) && data.length && data[0].entityName) {
    const entityConstructor = applicationContext.getEntityByName(
      data[0].entityName,
    );
    if (entityConstructor) {
      returnData = data.map(
        result =>
          new entityConstructor(result, {
            applicationContext,
            authorizedUser,
            filtered: true,
          }),
      );
    }
  } else if (data && data.entityName) {
    const entityConstructor = applicationContext.getEntityByName(
      data.entityName,
    );
    if (entityConstructor) {
      returnData = new entityConstructor(data, {
        applicationContext,
        authorizedUser,
        filtered: true,
      });
    }
  }
  return returnData;
};

export const checkMaintenanceMode = async ({ applicationContext }) => {
  const maintenanceRecord = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });

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
    const applicationContext = createApplicationContext(user, awsEvent.logger);

    delete awsEvent.logger;

    try {
      applicationContext.logger.debug('Request:', {
        request: awsEvent,
        user,
      });

      const { bypassMaintenanceCheck } = options;

      if (!bypassMaintenanceCheck) {
        await checkMaintenanceMode({ applicationContext });
      }

      const results = await cb({
        applicationContext,
        clientConnectionId,
      });

      const returnResults = dataSecurityFilter(results, {
        applicationContext,
        authorizedUser: user,
      });

      if (options.logResults !== false) {
        applicationContext.logger.debug('Results:', {
          results: returnResults,
        });
      }

      return returnResults;
    } catch (e) {
      if (!e.skipLogging) {
        // we don't want email alerts to be sent out just because someone searched for a non-existing case
        applicationContext.logger.error(e);
      }
      throw e;
    }
  });
};
