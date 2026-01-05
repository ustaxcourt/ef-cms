import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUnscheduledMinuteSheetsInteractor } from '@web-api/business/useCases/trialSessions/getUnscheduledMinuteSheetsInteractor';

export const getUnscheduledMinuteSheetsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    return await getUnscheduledMinuteSheetsInteractor(
      {
        trialSessionId: event.queryStringParameters.trialSessionId,
      },
      authorizedUser,
    );
  });
