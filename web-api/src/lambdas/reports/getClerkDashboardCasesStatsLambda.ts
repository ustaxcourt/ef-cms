import { APIGatewayProxyEvent } from 'aws-lambda';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getClerkDashboardCasesStatsInteractor } from '@web-api/business/useCases/reports/getClerkDashboardCasesStatsInteractor';

export const getClerkDashboardCasesStatsLambda = (
  event: APIGatewayProxyEvent,
  authorizedUser: UnknownAuthUser,
): ReturnType<typeof genericHandler> =>
  genericHandler(event, async () => {
    return await getClerkDashboardCasesStatsInteractor(authorizedUser);
  });
