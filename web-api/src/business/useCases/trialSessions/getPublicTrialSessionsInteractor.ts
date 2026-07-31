import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';
import { PublicTrialSessionInfoDTO } from '@shared/business/dto/trialSessions/PublicTrialSessionInfoDTO';

export const getPublicTrialSessionsInteractor = async (): Promise<
  PublicTrialSessionInfoDTO[]
> => {
  const trialSessions = await getTrialSessions();

  return trialSessions
    .map(t => new TrialSession(t).toRawObject())
    .map(trialSession => new PublicTrialSessionInfoDTO(trialSession))
    .filter(trialSession => trialSession.sessionStatus === 'Open');
};
