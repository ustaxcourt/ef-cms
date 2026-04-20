import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getClerkDashboardStatsInteractor } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';

export const getClerkDashboardStatsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await getClerkDashboardStatsInteractor(
      {
        year: event.queryStringParameters?.year
          ? parseInt(event.queryStringParameters.year)
          : undefined,
      },
      authorizedUser,
    );
  });
