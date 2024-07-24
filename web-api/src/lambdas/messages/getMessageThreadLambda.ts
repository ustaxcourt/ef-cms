import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getMessageThreadInteractor } from '@web-api/business/useCases/messages/getMessageThreadInteractor';

export const getMessageThreadLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getMessageThreadInteractor(
      applicationContext,
      {
        parentMessageId: event.pathParameters.parentMessageId,
      },
      authorizedUser,
    );
  });
