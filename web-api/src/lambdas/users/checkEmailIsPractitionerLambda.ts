import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { checkEmailIsPetitionerInteractor } from '@web-api/business/useCases/user/checkEmailIsPractitionerInteractor';

export const checkEmailIsPractitionerLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const body = JSON.parse(event.body);
    return await checkEmailIsPetitionerInteractor(
      {
        email: body.email,
      },
      authorizedUser,
    );
  });
