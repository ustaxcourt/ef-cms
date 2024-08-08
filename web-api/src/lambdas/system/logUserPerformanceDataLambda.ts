import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '@web-api/genericHandler';

export const logUserPerformanceDataLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const { performanceData } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .logUserPerformanceDataInteractor(
        applicationContext,
        performanceData,
        authorizedUser,
      );
  });
