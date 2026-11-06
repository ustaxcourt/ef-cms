import { APIGatewayProxyEvent } from 'aws-lambda';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getClerkDashboardPetitionsStatsInteractor } from '@web-api/business/useCases/reports/getClerkDashboardPetitionsStatsInteractor';

export const getClerkDashboardPetitionsStatsLambda = (
  event: APIGatewayProxyEvent,
  authorizedUser: UnknownAuthUser,
): ReturnType<typeof genericHandler> =>
  genericHandler(event, async () => {
    return await getClerkDashboardPetitionsStatsInteractor(authorizedUser);
  });
