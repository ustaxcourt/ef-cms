import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getRegStatusInteractor } from '@shared/business/useCases/automations/getRegStatusInteractor';

export const regStatusLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getRegStatusInteractor(
      applicationContext,
      {
        userEmail: event.pathParameters.userEmail,
      },
      authorizedUser,
    );
  });
