const { genericHandler } = require('../genericHandler');

/**
 * generate the judge activity report
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generateJudgeActivityReportLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .generateJudgeActivityReportInteractor(applicationContext, {
          ...event.queryStringParameters,
        });
    },
    { logResults: false },
  );
