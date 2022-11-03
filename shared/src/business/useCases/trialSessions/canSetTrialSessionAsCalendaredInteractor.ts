import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * canSetTrialSessionAsCalendaredInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSession trial session object
 * @returns {boolean} result of the entity method call depicting trial session calendaring eligibility
 */
export const canSetTrialSessionAsCalendaredInteractor = (
  applicationContext: IApplicationContext,
  { trialSession }: { trialSession: TTrialSessionData },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  const canSetAsCalendared = trialSessionEntity.canSetAsCalendared();
  const emptyFields = trialSessionEntity.getEmptyFields();
  const isRemote = trialSessionEntity.isRemote();

  return { canSetAsCalendared, emptyFields, isRemote };
};
