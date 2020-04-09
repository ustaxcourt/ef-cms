const { genericHandler } = require('../genericHandler');

/**
 * returns a single work item via the workItemId passed in the path of the url
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getWorkItemLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getWorkItemInteractor({
      applicationContext,
      workItemId: event.pathParameters.workItemId,
    });
  });
