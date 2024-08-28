import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { setWorkItemAsReadInteractor } from '@web-api/business/useCases/workItems/setWorkItemAsReadInteractor';

/**
 * assigns a list of work item ids to an assignee
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const setWorkItemAsReadLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { workItemId } = event.pathParameters || {};

    return await setWorkItemAsReadInteractor(
      applicationContext,
      {
        workItemId,
      },
      authorizedUser,
    );
  });
