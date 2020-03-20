const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for updating a docket entry on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.updateDocketEntryOnCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().updateDocketEntryInteractor({
      ...JSON.parse(event.body),
      applicationContext,
    });
  });
