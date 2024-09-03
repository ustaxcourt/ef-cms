import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getInboxMessagesForUserInteractor } from '@web-api/business/useCases/messages/getInboxMessagesForUserInteractor';

export const getInboxMessagesForUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getInboxMessagesForUserInteractor(
      applicationContext,
      {
        userId: event.pathParameters.userId,
      },
      authorizedUser,
    );
  });
