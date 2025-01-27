import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTrialSessionOpenCasesCountInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionOpenCasesCountInteractor';

export const getTrialSessionOpenCasesCountLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const { trialSessionId } = event.pathParameters || {};

    return await getTrialSessionOpenCasesCountInteractor(
      {
        trialSessionId,
      },
      authorizedUser,
    );
  });
