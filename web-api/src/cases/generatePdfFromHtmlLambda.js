const createApplicationContext = require('../applicationContext');
const { customHandle } = require('../customHandle');
const { getUserFromAuthHeader } = require('../middleware/apiGatewayHelper');

/**
 * used for generating a printable PDF of a docket record
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.handler = event =>
  customHandle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const {
      contentHtml,
      displayHeaderFooter,
      docketNumber,
      headerHtml,
    } = JSON.parse(event.body);

    try {
      const result = await applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor({
          applicationContext,
          contentHtml,
          displayHeaderFooter,
          docketNumber,
          headerHtml,
        });
      applicationContext.logger.info('User', user);
      applicationContext.logger.info('Docket Number', docketNumber);
      return result;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
