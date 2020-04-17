const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for adding a court issued order to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.fileCourtIssuedOrderToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .fileCourtIssuedOrderInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
