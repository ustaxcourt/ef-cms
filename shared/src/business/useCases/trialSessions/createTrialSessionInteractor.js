const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSession the trial session data
 * @returns {object} the created trial session
 */
exports.createTrialSessionInteractor = async ({
  applicationContext,
  trialSession,
}) => {
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

  return await applicationContext
    .getUseCaseHelpers()
    .createTrialSessionAndWorkingCopy({
      applicationContext,
      trialSessionToAdd,
    });
};
