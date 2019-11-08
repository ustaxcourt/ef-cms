const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');
const { handle } = require('../middleware/apiGatewayHelper');

/**
 * generic handler function for use in lambdas
 *
 * @param {object} event the AWS event object
 * @param {Function} cb the code to be executed
 * @param options
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.genericHandler = (event, cb) => {
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await cb({ applicationContext, user });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Results', results);
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
};
