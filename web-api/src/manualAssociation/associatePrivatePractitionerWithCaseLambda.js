const { genericHandler } = require('../genericHandler');

/**
 * associate practitioner with case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.associatePrivatePractitionerWithCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .associatePrivatePractitionerWithCaseInteractor({
        ...JSON.parse(event.body),
        applicationContext,
      });
  });
