const createApplicationContext = require('../applicationContext');
const { customHandle } = require('../customHandle');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * create court issued order pdf from html
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    try {
      const results = await applicationContext
        .getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor({
          ...JSON.parse(event.body),
          applicationContext,
        });
      applicationContext.logger.info('User', user);
      return results;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
