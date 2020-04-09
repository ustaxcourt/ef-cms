const { genericHandler } = require('../genericHandler');

/**
 * updates a work item
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.forwardWorkItemLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().forwardWorkItemInteractor({
      ...JSON.parse(event.body),
      applicationContext,
      workItemId: event.pathParameters.workItemId,
      workItemToUpdate: JSON.parse(event.body),
    });
  });
