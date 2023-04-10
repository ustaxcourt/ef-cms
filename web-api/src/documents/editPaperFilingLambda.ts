const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for editing a paper filing on a case before it is served
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.editPaperFilingLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .editPaperFilingInteractor(applicationContext, JSON.parse(event.body));
  });
