import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { checkEmailIsPractitionerInteractor } from '@web-api/business/useCases/user/checkEmailIsPractitionerInteractor';
import { parseEventBody } from '@web-api/business/utilities/parseEventBody';

export const checkEmailIsPractitionerLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const { email } = parseEventBody(event.body);
    return await checkEmailIsPractitionerInteractor(
      {
        email,
      },
      authorizedUser,
    );
  });
