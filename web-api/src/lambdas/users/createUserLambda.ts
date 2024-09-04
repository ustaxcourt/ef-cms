import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createUserInteractor } from '@web-api/business/useCases/user/createUserInteractor';
import { genericHandler } from '../../genericHandler';

// This is a special lambda that is only meant to be used by admins.
export const createUserLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await createUserInteractor(
      applicationContext,
      {
        user: JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
