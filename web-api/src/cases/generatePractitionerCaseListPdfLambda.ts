const { genericHandler } = require('../genericHandler');

/**
 * used for generating a printable PDF of a practitioners open and closed cases
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generatePractitionerCaseListPdfLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { userId } = event.pathParameters;

      return await applicationContext
        .getUseCases()
        .generatePractitionerCaseListPdfInteractor(applicationContext, {
          userId,
        });
    },
    { logResults: false },
  );
