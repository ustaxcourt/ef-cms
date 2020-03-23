const { genericHandler } = require('../genericHandler');

/**
 * creates a privatePractitioner or irsPractitioner user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createAttorneyUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().createAttorneyUserInteractor({
      applicationContext,
      user: JSON.parse(event.body).user,
    });
  });
