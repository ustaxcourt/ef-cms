const { genericHandler } = require('../genericHandler');

/**
 * used for generating the paper service PDF for the given trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generateTrialSessionPaperServicePdfLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const calendaredCasePdfDataArray = {
      ...JSON.parse(event.body),
    };

    console.log(
      'calendaredCasePdfDataArray LAMBDA',
      calendaredCasePdfDataArray,
    );

    return await applicationContext
      .getUseCases()
      .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
