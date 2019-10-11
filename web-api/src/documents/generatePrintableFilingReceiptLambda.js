const { customHandle } = require('../customHandle');
const createApplicationContext = require('../applicationContext');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * used for generating a printable filing receipt PDF
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const { documents } = JSON.parse(event.body);

    try {
      const result = await applicationContext
        .getUseCases()
        .generatePrintableFilingReceiptInteractor({
          applicationContext,
          documents,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Case ID', documents.caseId);
      return result;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
