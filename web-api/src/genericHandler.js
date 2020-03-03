const createApplicationContext = require('./applicationContext');
const { getUserFromAuthHeader } = require('./middleware/apiGatewayHelper');
const { handle } = require('./middleware/apiGatewayHelper');

/**
 * generic handler function for use in lambdas
 *
 * @param {object} event the AWS event object
 * @param {Function} cb the code to be executed
 * @param options
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.genericHandler = (event, cb, options = {}) => {
  return handle(event, async () => {
    const user = options.user || getUserFromAuthHeader(event);
    const applicationContext =
      options.applicationContext || createApplicationContext(user); // This is mostly for testing purposes
    const honeybadger = applicationContext.initHoneybadger();

    const {
      isPublicUser,
      logEvent = false,
      logEventLabel = 'Event',
      logResults = true,
      logResultsLabel = 'Results',
      logUser = true,
      logUserLabel = 'User',
    } = options;

    try {
      if (logEvent && applicationContext) {
        applicationContext.logger.info(logEventLabel, event);
      }

      if (logUser && applicationContext) {
        let userToLog = user;
        if (isPublicUser) {
          userToLog = 'Public User';
        }
        applicationContext.logger.info(logUserLabel, userToLog);
      }

      const results = await cb({ applicationContext, user });

      let returnResults = results;
      if (results && results.entityName) {
        const entityConstructor = applicationContext.getEntityByName(
          results.entityName,
        );
        returnResults = new entityConstructor(results, {
          applicationContext,
          filtered: true,
        });
      }

      if (logResults && applicationContext) {
        applicationContext.logger.info(logResultsLabel, returnResults);
      }

      return returnResults;
    } catch (e) {
      if (!e.skipLogging) {
        // we don't want email alerts to be sent out just because someone searched for a non-existing case
        applicationContext.logger.error(e);
        honeybadger && honeybadger.notify(e);
      }
      throw e;
    }
  });
};
