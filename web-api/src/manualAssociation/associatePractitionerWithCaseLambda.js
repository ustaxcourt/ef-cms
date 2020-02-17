const { genericHandler } = require('../genericHandler');

/**
 * associate practitioner with case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.handler = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .associatePractitionerWithCaseInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
