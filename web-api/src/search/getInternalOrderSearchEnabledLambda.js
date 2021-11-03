const { genericHandler } = require('../genericHandler');

/**
 * gets the internal order search enabled flag
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getInternalOrderSearchEnabledLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getInternalOrderSearchEnabledInteractor(applicationContext);
  });
