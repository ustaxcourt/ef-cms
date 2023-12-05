import { genericHandler } from '../../genericHandler';

/**
 * updates a work item
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const completeWorkItemLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .completeWorkItemInteractor(applicationContext, {
        completedMessage: JSON.parse(event.body).completedMessage,
        workItemId: event.pathParameters.workItemId,
      });
  });
