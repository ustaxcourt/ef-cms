const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

const ELIGIBLE_CASES_BUFFER = 50;
/**
 * get eligible cases for trial session
 *
 * @param trialSessionId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getEligibleCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession);

  trialSessionEntity.validate();

  return await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialSession({
      applicationContext,
      limit: trialSessionEntity.maxCases + ELIGIBLE_CASES_BUFFER,
      skPrefix: trialSessionEntity.generateSortKeyPrefix(),
    });
};
