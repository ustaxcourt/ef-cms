import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCompletedMessagesForUserInteractor } from '@web-api/business/useCases/messages/getCompletedMessagesForUserInteractor';

export const getCompletedMessagesForUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getCompletedMessagesForUserInteractor(
      applicationContext,
      {
        userId: event.pathParameters.userId,
      },
      authorizedUser,
    );
  });
