import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const getMessageThreadLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getMessageThreadInteractor(
      applicationContext,
      {
        parentMessageId: event.pathParameters.parentMessageId,
      },
      authorizedUser,
    );
  });
