import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getTrialSessionAssociatedCasesCountInteractor } from '@web-api/business/useCases/trialSessions/getTrialSessionAssociatedCasesCountInteractor';

export const getTrialSessionOpenCasesCountLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async () => {
    const { trialSessionId } = event.pathParameters || {};

    return await getTrialSessionAssociatedCasesCountInteractor(
      {
        trialSessionId,
      },
      authorizedUser,
    );
  });
