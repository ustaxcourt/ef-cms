const { genericHandler } = require('../genericHandler');

/**
 * updates the user contact info (used for a practitioner or respondent)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateUserContactInformationInteractor({
        applicationContext,
        contactInfo:
          typeof event.body === 'string' ? JSON.parse(event.body) : event.body,
        userId: (event.pathParameters || event.path).userId,
      });
  });
