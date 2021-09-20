const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { TRIAL_SESSION_SCOPE_TYPES } = require('../../entities/EntityConstants');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {object} the created trial session
 */
exports.createTrialSessionInteractor = async (
  applicationContext,
  { trialSession },
) => {
  const user = applicationContext.getCurrentUser();

  const trialSessionToAdd = new TrialSession(trialSession, {
    applicationContext,
  });

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (['Motion/Hearing', 'Special'].includes(trialSessionToAdd.sessionType)) {
    trialSessionToAdd.setAsCalendared();
  }

  if (
    trialSessionToAdd.sessionScope ===
    TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
  ) {
    trialSessionToAdd.setAsCalendared();
  }

  return await applicationContext
    .getUseCaseHelpers()
    .createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });
};
