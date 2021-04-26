const { genericHandler } = require('../genericHandler');

/**
 * lambda used for adding a paper filing to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addPaperFilingLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .addPaperFilingInteractor(applicationContext, JSON.parse(event.body));
  });
