import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '../../../../../shared/src/business/dto/trialSessions/TrialSessionInfoDTO';

export const getPublicTrialSessionsInteractor = async (
  applicationContext: ServerApplicationContext,
): Promise<TrialSessionInfoDTO[]> => {
  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  return trialSessions
    .map(t => new TrialSession(t).toRawObject())
    .map(trialSession => new TrialSessionInfoDTO(trialSession))
    .filter(trialSession => trialSession.sessionStatus === 'Open');
};
