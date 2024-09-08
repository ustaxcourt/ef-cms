import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { assignWorkItemsInteractor } from '@web-api/business/useCases/workItems/assignWorkItemsInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * assigns a list of work item ids to an assignee
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const assignWorkItemsLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await assignWorkItemsInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
