import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '@shared/business/dto/trialSessions/TrialSessionInfoDTO';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';

export const getPublicTrialSessionsInteractor = async (): Promise<
  TrialSessionInfoDTO[]
> => {
  const trialSessions = await getTrialSessions();

  return trialSessions
    .map(t => new TrialSession(t).toRawObject())
    .map(trialSession => new TrialSessionInfoDTO(trialSession))
    .filter(trialSession => trialSession.sessionStatus === 'Open');
};
