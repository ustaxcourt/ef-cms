const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for adding a petitioner to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addPetitionerToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .addPetitionerToCaseInteractor(applicationContext, {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      });
  });
