import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { deactivateUserInteractor } from '@web-api/business/useCases/automations/deactivateUserInteractor';

export const deactivateUserLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async () => {
    return await deactivateUserInteractor(
      JSON.parse(event.body),
      authorizedUser,
    );
  });
