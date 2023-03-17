const { genericHandler } = require('../genericHandler');

/**
 * returns the users inbox
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getDocumentQCInboxForUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { userId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getDocumentQCInboxForUserInteractor(applicationContext, {
        userId,
      });
  });
