const { genericHandler } = require('../genericHandler');

/**
 * used for deleting a case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.deleteCaseNoteLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deleteCaseNoteInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
