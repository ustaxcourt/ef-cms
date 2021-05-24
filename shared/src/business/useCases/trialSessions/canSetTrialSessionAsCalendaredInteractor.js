const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * canSetTrialSessionAsCalendaredInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSession trial session object
 * @returns {boolean} result of the entity method call depicting trial session calendaring eligibility
 */
exports.canSetTrialSessionAsCalendaredInteractor = (
  applicationContext,
  { trialSession },
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

  return { canSetAsCalendared, emptyFields };
};
