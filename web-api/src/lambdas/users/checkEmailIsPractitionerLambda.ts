import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { checkEmailIsPractitionerInteractor } from '@web-api/business/useCases/user/checkEmailIsPractitionerInteractor';

export const checkEmailIsPractitionerLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const { email } = JSON.parse(event.body);
    return await checkEmailIsPractitionerInteractor(
      {
        email,
      },
      authorizedUser,
    );
  });
