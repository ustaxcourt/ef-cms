const { genericHandler } = require('../genericHandler');

/**
 * used for saving a case's calendar note for a trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.saveCalendarNoteLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const lambdaArguments = {
      ...event.pathParameters,
      ...JSON.parse(event.body),
    };

    return await applicationContext
      .getUseCases()
      .saveCalendarNoteInteractor(applicationContext, {
        ...lambdaArguments,
      });
  });
