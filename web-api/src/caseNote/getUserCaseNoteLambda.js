const { genericHandler } = require('../genericHandler');

/**
 * used for fetching a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getUserCaseNoteLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getUserCaseNoteInteractor({
      applicationContext,
      ...event.pathParameters,
    });
  });
