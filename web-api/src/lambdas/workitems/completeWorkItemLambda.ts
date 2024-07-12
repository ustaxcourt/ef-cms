import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { completeWorkItemInteractor } from '@web-api/business/useCases/workItems/completeWorkItemInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * updates a work item
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const completeWorkItemLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await completeWorkItemInteractor(
        applicationContext,
        {
          completedMessage: JSON.parse(event.body).completedMessage,
          workItemId: event.pathParameters.workItemId,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
