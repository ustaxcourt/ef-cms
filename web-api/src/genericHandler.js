const createApplicationContext = require('./applicationContext');
const {
  getConnectionIdFromEvent,
  getUserFromAuthHeader,
} = require('./middleware/apiGatewayHelper');
const { handle } = require('./middleware/apiGatewayHelper');

exports.dataSecurityFilter = (data, { applicationContext }) => {
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
        filtered: true,
      });
    }
  }
  return returnData;
};

const checkMaintenanceMode = async ({ applicationContext }) => {
  const maintenanceRecord = await applicationContext
    .getPersistenceGateway()
    .getMaintenanceMode({ applicationContext });

  const maintenanceMode = !!(maintenanceRecord && maintenanceRecord.current);

  if (maintenanceMode) {
    throw new Error('Maintenance mode is enabled');
  }

  return maintenanceMode;
};

exports.checkMaintenanceMode = checkMaintenanceMode;

/**
 * generic handler function for use in lambdas
 *
 * @param {object} awsEvent the AWS event object
 * @param {Function} cb the code to be executed
 * @param options
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.genericHandler = (awsEvent, cb, options = {}) => {
  return handle(awsEvent, async () => {
    //TODO: grab the connectionId/tabId in a similar fashion as the auth user is (query string or header)
    const connectionId = getConnectionIdFromHeader(awsEvent);
    const user = options.user || getUserFromAuthHeader(awsEvent);
    const applicationContext =
      options.applicationContext ||
      createApplicationContext(user, awsEvent.logger);

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

      const results = await cb({ applicationContext, user });

      const returnResults = exports.dataSecurityFilter(results, {
        applicationContext,
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
