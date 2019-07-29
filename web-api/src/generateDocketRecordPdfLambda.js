const createApplicationContext = require('./applicationContext');
const {
  getUserFromAuthHeader,
  handle,
} = require('./middleware/apiGatewayHelper');

/**
 * used for generating a printable PDF of a docket record
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.handler = event =>
  handle(event, async () => {
    const user = getUserFromAuthHeader(event);
    const applicationContext = createApplicationContext(user);
    const { docketNumber, pdfFile } = JSON.parse(event.body);

    try {
      const result = await applicationContext
        .getUseCases()
        .generateDocketRecordPdfInteractor({
          applicationContext,
          docketNumber,
          pdfFile,
        });
      applicationContext.logger.info('User', user);
      return result;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
