const { genericHandler } = require('../genericHandler');

/**
 * associate irsPractitioner with case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.associateIrsPractitionerWithCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .associateIrsPractitionerWithCaseInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
