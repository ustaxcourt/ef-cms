const { genericHandler } = require('../genericHandler');

/**
 * gets the order search enabled flag
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getOrderSearchEnabledLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getOrderSearchEnabledInteractor(applicationContext);
  });
