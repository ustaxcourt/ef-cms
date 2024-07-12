import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const generateEntryOfAppearancePdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .generateEntryOfAppearancePdfInteractor(
          applicationContext,
          {
            ...event.pathParameters,
            ...JSON.parse(event.body),
          },
          authorizedUser,
        );
    },
    authorizedUser,
  );
