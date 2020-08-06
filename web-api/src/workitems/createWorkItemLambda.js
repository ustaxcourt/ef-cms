const { genericHandler } = require('../genericHandler');

/**
 * updates a work item
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.createWorkItemLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().createWorkItemInteractor({
      applicationContext,
      ...event.pathParameters,
      ...JSON.parse(event.body),
    });
  });
