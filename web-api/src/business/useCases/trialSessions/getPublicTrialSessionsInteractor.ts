import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { PublicTrialSessionInfo } from '@shared/business/dto/trialSessions/PublicTrialSessionInfo';

export const getPublicTrialSessionsInteractor = async (): Promise<
  PublicTrialSessionInfo[]
> => {
  const trialSessions = await getTrialSessions();

  return trialSessions
    .map(t => new TrialSession(t).toRawObject())
    .map(trialSession => new PublicTrialSessionInfo(trialSession))
    .filter(trialSession => trialSession.sessionStatus === 'Open');
};
