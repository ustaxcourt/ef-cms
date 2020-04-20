const { genericHandler } = require('../genericHandler');

/**
 * lambda which is used for creating a new case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().createCaseInteractor({
      ...JSON.parse(event.body),
      applicationContext,
    });
  });
