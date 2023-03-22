const { genericHandler } = require('../genericHandler');

/**
 * generate the printable case inventory report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generatePrintableCaseInventoryReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .generatePrintableCaseInventoryReportInteractor(applicationContext, {
          ...event.queryStringParameters,
        });
    },
    { logResults: false },
  );
