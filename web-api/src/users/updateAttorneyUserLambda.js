const { genericHandler } = require('../genericHandler');

/**
 * updates a privatePractitioner or irsPractitioner user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateAttorneyUserLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().updateAttorneyUserInteractor({
      applicationContext,
      user: JSON.parse(event.body).user,
    });
  });
