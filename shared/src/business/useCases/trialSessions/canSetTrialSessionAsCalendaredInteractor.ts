import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  RawTrialSession,
  TrialSession,
} from '../../entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * canSetTrialSessionAsCalendaredInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSession trial session object
 * @returns {boolean} result of the entity method call depicting trial session calendaring eligibility
 */
export const canSetTrialSessionAsCalendaredInteractor = (
  authorizedUser: UnknownAuthUser,
  { trialSession }: { trialSession: RawTrialSession },
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSessionEntity = new TrialSession(trialSession);

  const canSetAsCalendared = trialSessionEntity.canSetAsCalendared();
  const emptyFields = trialSessionEntity.getEmptyFields();
  const isRemote = trialSessionEntity.isRemote();

  return { canSetAsCalendared, emptyFields, isRemote };
};
