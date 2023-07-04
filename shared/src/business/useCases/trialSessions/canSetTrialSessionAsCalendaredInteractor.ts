import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionFactory } from '../../entities/trialSessions/TrialSessionFactory';
import { UnauthorizedError } from '../../../errors/errors';

export const canSetTrialSessionAsCalendaredInteractor = (
  applicationContext: IApplicationContext,
  { trialSession }: { trialSession: RawTrialSession },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionEntity = TrialSessionFactory(
    trialSession,
    applicationContext,
  );

  const canSetAsCalendared = trialSessionEntity.canSetAsCalendared();
  const emptyFields = trialSessionEntity.getEmptyFields();
  const isRemote = trialSessionEntity.isRemote();

  return { canSetAsCalendared, emptyFields, isRemote };
};
