import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { removeUserPendingEmailInteractor } from '@shared/business/useCases/automations/removeUserPendingEmailInteractor';

export const removeUserPendingEmailLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await removeUserPendingEmailInteractor(
      JSON.parse(event.body),
      authorizedUser,
    );
  });
