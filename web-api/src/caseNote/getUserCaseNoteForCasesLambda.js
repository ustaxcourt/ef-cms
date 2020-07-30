const { genericHandler } = require('../genericHandler');

/**
 * used for fetching a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getUserCaseNoteForCasesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { docketNumbers } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .getUserCaseNoteForCasesInteractor({
        applicationContext,
        docketNumbers: docketNumbers.split(','),
      });
  });
