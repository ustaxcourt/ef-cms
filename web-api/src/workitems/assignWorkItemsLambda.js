const { genericHandler } = require('../genericHandler');

/**
 * assigns a list of work item ids to an assignee
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.assignWorkItemsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().assignWorkItemsInteractor({
      applicationContext,
      ...JSON.parse(event.body),
    });
  });
