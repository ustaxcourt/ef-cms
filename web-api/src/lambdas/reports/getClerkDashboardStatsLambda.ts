import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getClerkDashboardStatsInteractor } from '@web-api/business/useCases/reports/getClerkDashboardStatsInteractor';

export const getClerkDashboardStatsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const rawYear = event.queryStringParameters?.year;
    const parsedYear = rawYear ? parseInt(rawYear, 10) : undefined;
    return await getClerkDashboardStatsInteractor(
      { year: parsedYear },
      authorizedUser,
    );
  });
