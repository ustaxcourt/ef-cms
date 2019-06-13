const {
  isAuthorized,
  TRIAL_SESSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/Case');
const { TrialSession } = require('../../entities/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * set trial session calendar
 *
 * @param trialSessionId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.setTrialSessionCalendar = async ({
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

  const eligibleCases = await applicationContext
    .getPersistenceGateway()
    .getEligibleCasesForTrialSession({
      applicationContext,
      limit: trialSessionEntity.maxCases,
      skPrefix: trialSessionEntity.generateSortKeyPrefix(),
    });

  for (let caseRecord of eligibleCases) {
    const caseId = caseRecord.caseId;
    const caseEntity = new Case(caseRecord);

    caseEntity.setAsCalendared(trialSessionEntity);
    trialSessionEntity.addCaseToCalendar(caseEntity);

    await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

    await applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        caseId,
      });
  }

  trialSessionEntity.setAsCalendared();

  return await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
