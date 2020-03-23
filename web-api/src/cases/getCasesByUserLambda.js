const { genericHandler } = require('../genericHandler');

/**
 * used for fetching all cases of a particular status, user role, etc
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCasesByUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { userId } = event.pathParameters || {};

    return await applicationContext.getUseCases().getCasesByUserInteractor({
      applicationContext,
      userId,
    });
  });
