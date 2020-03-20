const { genericHandler } = require('../genericHandler');

/**
 * create court issued order pdf from html
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createCourtIssuedOrderPdfFromHtmlLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .createCourtIssuedOrderPdfFromHtmlInteractor({
          ...JSON.parse(event.body),
          applicationContext,
        });
    },
    { logResults: false },
  );
