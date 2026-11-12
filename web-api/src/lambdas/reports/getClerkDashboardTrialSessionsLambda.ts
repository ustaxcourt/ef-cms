import { APIGatewayProxyEvent } from 'aws-lambda';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getClerkDashboardTrialSessionsInteractor } from '@web-api/business/useCases/reports/getClerkDashboardTrialSessionsInteractor';

export const getClerkDashboardTrialSessionsLambda = (
  event: APIGatewayProxyEvent,
  authorizedUser: UnknownAuthUser,
): ReturnType<typeof genericHandler> =>
  genericHandler(event, async () => {
    return await getClerkDashboardTrialSessionsInteractor(authorizedUser);
  });
