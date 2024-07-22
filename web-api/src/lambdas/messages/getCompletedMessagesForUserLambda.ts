import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getCompletedMessagesForUserLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCompletedMessagesForUserInteractor(
        applicationContext,
        {
          userId: event.pathParameters.userId,
        },
        authorizedUser,
      );
  });
