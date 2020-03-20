const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for adding a docket entry to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.fileDocketEntryToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().fileDocketEntryInteractor({
      ...JSON.parse(event.body),
      applicationContext,
    });
  });
