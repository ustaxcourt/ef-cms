const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { isEmpty, isEqual } = require('lodash');
const { TRIAL_SESSION_SCOPE_TYPES } = require('../../entities/EntityConstants');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * closeTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to be closed
 * @returns {Promise} the promise of the updateTrialSession call
 */
exports.closeTrialSessionInteractor = async (
  applicationContext,
  { trialSessionId },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSession) {
    throw new Error('trial session not found');
  }

  if (
    trialSession.sessionScope !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote
  ) {
    throw new Error(
      'Only standalone remote trial sessions can be closed manually',
    );
  }

  if (
    trialSession.startDate >
    applicationContext.getUtilities().createISODateString()
  ) {
    throw new Error(
      'Trial session cannot be closed until after its start date',
    );
  }

  const allCases = trialSession.caseOrder || [];
  const inactiveCases = allCases.filter(
    sessionCase => sessionCase.removedFromTrial === true,
  );

  if (!isEmpty(allCases) && !isEqual(allCases, inactiveCases)) {
    throw new Error('Trial session cannot be closed with open cases');
  }

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.setAsClosed();

  return await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
