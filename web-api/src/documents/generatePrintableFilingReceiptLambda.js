const { genericHandler } = require('../genericHandler');

/**
 * used for generating a printable filing receipt PDF
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generatePrintableFilingReceiptLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .generatePrintableFilingReceiptInteractor({
        applicationContext,
        ...JSON.parse(event.body),
      });
  });
