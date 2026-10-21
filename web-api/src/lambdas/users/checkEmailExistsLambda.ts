import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { checkEmailExistsInteractor } from '@web-api/business/useCases/user/checkEmailExistsInteractor';

export const checkEmailExistsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const body = JSON.parse(event.body);
    return await checkEmailExistsInteractor(
      {
        email: body.email,
      },
      authorizedUser,
    );
  });
