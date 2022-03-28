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
  { status = SESSION_STATUS_GROUPS.all } = {},
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

  let trialSessions;

  switch (status) {
    case SESSION_STATUS_GROUPS.closed:
      trialSessions = await applicationContext
        .getPersistenceGateway()
        .getClosedTrialSessions({
          applicationContext,
          isClosed: rawTrialSession => {
            const trialSession = new TrialSession(rawTrialSession, {
              applicationContext,
            });
            return trialSession.getStatus() === SESSION_STATUS_GROUPS.closed;
          },
        });
      break;
    case SESSION_STATUS_GROUPS.new:
      trialSessions = await applicationContext
        .getPersistenceGateway()
        .getNewTrialSessions({
          applicationContext,
        });
      break;
    case SESSION_STATUS_GROUPS.open:
      trialSessions = await applicationContext
        .getPersistenceGateway()
        .getOpenTrialSessions({
          applicationContext,
        });
      break;
    case SESSION_STATUS_GROUPS.all:
      trialSessions = await applicationContext
        .getPersistenceGateway()
        .getTrialSessions({
          applicationContext,
        });
      break;
  }

  return TrialSession.validateRawCollection(trialSessions, {
    applicationContext,
  });
};
