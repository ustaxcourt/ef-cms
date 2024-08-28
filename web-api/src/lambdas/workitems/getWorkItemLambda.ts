import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getWorkItemInteractor } from '@web-api/business/useCases/workItems/getWorkItemInteractor';

/**
 * returns a single work item via the workItemId passed in the path of the url
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getWorkItemLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getWorkItemInteractor(
      applicationContext,
      {
        workItemId: event.pathParameters.workItemId,
      },
      authorizedUser,
    );
  });
