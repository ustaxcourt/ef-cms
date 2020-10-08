const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Removes a manually added case from the trial session
 *
 * @param {object} applicationContext the application context
 * @param {object} caseRecord the case to remove from the trial session
 * @param {object} trialSessionEntity the trial session to remove the case from
 * @returns {Promise} the promise of the updateCase call
 */
const removeManuallyAddedCaseFromTrialSession = ({
  applicationContext,
  caseRecord,
  trialSessionEntity,
}) => {
  trialSessionEntity.deleteCaseFromCalendar({
    docketNumber: caseRecord.docketNumber,
  });

  const caseEntity = new Case(caseRecord, { applicationContext });

  caseEntity.removeFromTrialWithAssociatedJudge();

  return applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};

/**
 * set trial session calendar
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialSessionId the id of the trial session to set the calendar
 * @returns {Promise} the promise of the updateTrialSession call
 */
exports.setTrialSessionCalendarInteractor = async ({
  applicationContext,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SET_TRIAL_SESSION_CALENDAR)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  trialSessionEntity.validate();

  trialSessionEntity.setAsCalendared();

  //get cases that have been manually added so we can set them as calendared
  const manuallyAddedCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const manuallyAddedQcCompleteCases = [];
  const manuallyAddedQcIncompleteCases = [];

  // these cases are already on the caseOrder, so if they have not been QCed we have to remove them
  manuallyAddedCases.forEach(manualCase => {
    if (
      manualCase.qcCompleteForTrial &&
      manualCase.qcCompleteForTrial[trialSessionId] === true
    ) {
      manuallyAddedQcCompleteCases.push(manualCase);
    } else {
      manuallyAddedQcIncompleteCases.push(manualCase);
    }
  });

  let eligibleCasesLimit = trialSessionEntity.maxCases;

  if (manuallyAddedQcCompleteCases.length > 0) {
    eligibleCasesLimit -= manuallyAddedQcCompleteCases.length;
  }

  const eligibleCases = (
    await applicationContext
      .getPersistenceGateway()
      .getEligibleCasesForTrialSession({
        applicationContext,
        limit: eligibleCasesLimit,
        skPrefix: trialSessionEntity.generateSortKeyPrefix(),
      })
  ).filter(
    eligibleCase =>
      eligibleCase.qcCompleteForTrial &&
      eligibleCase.qcCompleteForTrial[trialSessionId] === true,
  );

  /**
   * sets a manually added case as calendared with the trial session details
   *
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promise of the updateCase call
   */
  const setManuallyAddedCaseAsCalendared = caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);

    return Promise.all([
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        highPriority: true,
        trialDate: caseEntity.trialDate,
      }),
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
    ]);
  };

  /**
   * sets an eligible case as calendared and adds it to the trial session calendar
   *
   * @param {object} caseRecord the providers object
   * @returns {Promise} the promises of the updateCase and deleteCaseTrialSortMappingRecords calls
   */
  const setTrialSessionCalendarForEligibleCase = caseRecord => {
    const caseEntity = new Case(caseRecord, { applicationContext });

    caseEntity.setAsCalendared(trialSessionEntity);
    trialSessionEntity.addCaseToCalendar(caseEntity);

    return Promise.all([
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
        highPriority: true,
        trialDate: caseEntity.trialDate,
      }),
      applicationContext.getPersistenceGateway().updateCase({
        applicationContext,
        caseToUpdate: caseEntity.validate().toRawObject(),
      }),
      applicationContext
        .getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
        }),
    ]);
  };

  await Promise.all([
    ...manuallyAddedQcIncompleteCases.map(caseRecord =>
      removeManuallyAddedCaseFromTrialSession({
        applicationContext,
        caseRecord,
        trialSessionEntity,
      }),
    ),
    ...manuallyAddedQcCompleteCases.map(setManuallyAddedCaseAsCalendared),
    ...eligibleCases.map(setTrialSessionCalendarForEligibleCase),
  ]);

  const updatedTrialSession = await applicationContext
    .getPersistenceGateway()
    .updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });

  return new TrialSession(updatedTrialSession, { applicationContext })
    .validate()
    .toRawObject();
};
