const { genericHandler } = require('../genericHandler');

/**
 * get all case deadlines
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getAllCaseDeadlinesLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    console.log(
      'applicationContext.getUseCases()',
      applicationContext.getUseCases(),
    );
    console.log(
      'typeof applicationContext.getUseCases().getCaseDeadlinesAllInteractor is',
      typeof applicationContext.getUseCases().getCaseDeadlinesAllInteractor,
    );
    return await applicationContext
      .getUseCases()
      .getCaseDeadlinesAllInteractor({
        applicationContext,
      });
  });
