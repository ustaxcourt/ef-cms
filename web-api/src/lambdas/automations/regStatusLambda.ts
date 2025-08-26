import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getRegStatusInteractor } from '@shared/business/useCases/automations/getRegStatusInteractor';

export const regStatusLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async () => {
    const { userEmail } = event.queryStringParameters;
    return await getRegStatusInteractor(
      {
        userEmail,
      },
      authorizedUser,
    );
  });
