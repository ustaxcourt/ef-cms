import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPractitionerCasesInteractor } from '@shared/business/useCases/getPractitionerCasesInteractor';

export const getPractitionerCasesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { userId } = event.pathParameters;

      return await getPractitionerCasesInteractor(
        applicationContext,
        {
          userId,
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
