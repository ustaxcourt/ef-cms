const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { SESSION_STATUS_GROUPS } = require('../../entities/EntityConstants');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getTrialSessionsInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Array<TrialSession>} the trial sessions returned from persistence
 */
exports.getTrialSessionsInteractor = async (
  applicationContext,
  { status = SESSION_STATUS_GROUPS.all },
) => {
  const allowedStatuses = [
    SESSION_STATUS_GROUPS.closed,
    SESSION_STATUS_GROUPS.new,
    SESSION_STATUS_GROUPS.open,
    SESSION_STATUS_GROUPS.all,
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const statusToMethodMap = {
    [SESSION_STATUS_GROUPS.closed]: 'getClosedTrialSessions',
    [SESSION_STATUS_GROUPS.new]: 'getNewTrialSessions',
    [SESSION_STATUS_GROUPS.open]: 'getOpenTrialSessions',
    [SESSION_STATUS_GROUPS.all]: 'getTrialSessions',
  };

  const methodNameToCall = statusToMethodMap[status];
  const methodToCall =
    applicationContext.getPersistenceGateway()[methodNameToCall];

  const trialSessions = await methodToCall({
    applicationContext,
    isClosed: rawTrialSession => {
      const trialSession = new TrialSession(rawTrialSession, {
        applicationContext,
      });
      return trialSession.getStatus() === SESSION_STATUS_GROUPS.closed;
    },
  });

  return TrialSession.validateRawCollection(trialSessions, {
    applicationContext,
  });
};
