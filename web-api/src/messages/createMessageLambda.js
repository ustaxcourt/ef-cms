const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for creating a new message
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createMessageLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().createMessageInteractor({
      ...JSON.parse(event.body),
      applicationContext,
    });
  });
