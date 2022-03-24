const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { isEmpty, isEqual } = require('lodash');
const { TRIAL_SESSION_SCOPE_TYPES } = require('../../entities/EntityConstants');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

// TODO: probably grab from entity constants
const TRIAL_SESSION_STATUSES = {
  CLOSED: 'closed',
  NEW: 'new',
  OPEN: 'open',
};

/**
 * getTrialSessionsInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Array<TrialSession>} the trial sessions returned from persistence
 */
exports.getTrialSessionsInteractor = async (applicationContext, { status }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let trialSessions;
  if (status === TRIAL_SESSION_STATUSES.CLOSED) {
    const allSessions = await applicationContext
      .getPersistenceGateway()
      .getTrialSessions({ applicationContext });

    trialSessions = allSessions.filter(session => {
      const allCases = session.caseOrder || [];
      const inactiveCases = allCases.filter(
        sessionCase => sessionCase.removedFromTrial === true,
      );

      if (
        session.isClosed ||
        (!isEmpty(allCases) &&
          isEqual(allCases, inactiveCases) &&
          session.sessionScope !== TRIAL_SESSION_SCOPE_TYPES.standaloneRemote)
      ) {
        return true;
      }
    });
  } else if (status === TRIAL_SESSION_STATUSES.NEW) {
    trialSessions = await applicationContext
      .getPersistenceGateway()
      .getNewTrialSessions({ applicationContext });
  } else if (status === TRIAL_SESSION_STATUSES.OPEN) {
    trialSessions = await applicationContext
      .getPersistenceGateway()
      .getOpenTrialSessions({ applicationContext });
  } else {
    trialSessions = await applicationContext
      .getPersistenceGateway()
      .getTrialSessions({
        applicationContext,
      });
  }

  return TrialSession.validateRawCollection(trialSessions, {
    applicationContext,
  });
};
