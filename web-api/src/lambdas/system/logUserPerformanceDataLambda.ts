import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '@web-api/genericHandler';

export const logUserPerformanceDataLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .logUserPerformanceDataInteractor(
        applicationContext,
        JSON.parse(event.body),
        authorizedUser,
      );
  });
