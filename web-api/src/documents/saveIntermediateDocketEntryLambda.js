const { genericHandler } = require('../genericHandler');

/**
 * save intermediate docket entry
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .saveIntermediateDocketEntryInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
