const { genericHandler } = require('../genericHandler');

/**
 * will create a new petitioner account and attach that user to the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.addNewUserToCaseLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().addNewUserToCaseInteractor({
      applicationContext,
      ...event.pathParameters,
      ...JSON.parse(event.body),
    });
  });
