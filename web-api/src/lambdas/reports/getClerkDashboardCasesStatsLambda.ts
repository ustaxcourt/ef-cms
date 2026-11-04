import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getClerkDashboardCasesStatsInteractor } from '@web-api/business/useCases/reports/getClerkDashboardCasesStatsInteractor';

export const getClerkDashboardCasesStatsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await getClerkDashboardCasesStatsInteractor(authorizedUser);
  });
