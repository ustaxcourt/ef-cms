const { genericHandler } = require('../genericHandler');

/**
 * complete docket entry qc
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.completeDocketEntryQCLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .completeDocketEntryQCInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
