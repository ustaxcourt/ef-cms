const { genericHandler } = require('../genericHandler');

/**
 * returns the judge associated with a chambers section
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getJudgeInSectionLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getJudgeInSectionInteractor(applicationContext, {
        section: event.pathParameters.section,
      });
  });
