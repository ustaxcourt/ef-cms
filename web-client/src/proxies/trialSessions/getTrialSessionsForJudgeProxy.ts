import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getTrialSessionsForJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  judgeId,
): Promise<TrialSessionInfoDTO[]> => {
  return get({
    applicationContext,
    endpoint: `/judges/${judgeId}/trial-sessions?fields=trialLocation,trialSessionId,sessionStatus,startDate`,
  });
};
