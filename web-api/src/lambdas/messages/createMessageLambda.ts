import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createMessageInteractor } from '@web-api/business/useCases/messages/createMessageInteractor';
import { genericHandler } from '../../genericHandler';

export const createMessageLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async () => {
    return await createMessageInteractor(
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
