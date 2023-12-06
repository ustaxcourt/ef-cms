import { genericHandler } from '../../genericHandler';

/**
 * assigns a list of work item ids to an assignee
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setWorkItemAsReadLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { workItemId } = event.pathParameters || {};

    return await applicationContext
      .getUseCases()
      .setWorkItemAsReadInteractor(applicationContext, {
        workItemId,
      });
  });
