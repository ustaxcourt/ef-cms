import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

export const updateDocketEntryMetaLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateDocketEntryMetaInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
          ...event.pathParameters,
        },
        authorizedUser,
      );
  });
