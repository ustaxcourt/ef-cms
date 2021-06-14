const { genericHandler } = require('../genericHandler');

/**
 * calls the interactor for obtaining a mapping of a given array of userIds and
 * their associated pending email addresses (if they exist)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getUsersPendingEmailLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const userIds = event.queryStringParameters.userIds?.split(',') || [];

    return await applicationContext
      .getUseCases()
      .getUsersPendingEmailInteractor(applicationContext, {
        userIds,
      });
  });
