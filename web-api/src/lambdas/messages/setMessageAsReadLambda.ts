import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { setMessageAsReadInteractor } from '@web-api/business/useCases/messages/setMessageAsReadInteractor';

export const setMessageAsReadLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const { messageId } = event.pathParameters || {};

    return await setMessageAsReadInteractor(
      {
        messageId,
      },
      authorizedUser,
    );
  });
