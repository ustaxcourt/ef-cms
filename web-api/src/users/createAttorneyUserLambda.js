const { genericHandler } = require('../genericHandler');

/**
 * creates a practitioner or respondent user
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().createAttorneyUserInteractor({
      applicationContext,
      user: JSON.parse(event.body).user,
    });
  });
