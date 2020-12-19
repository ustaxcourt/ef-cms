const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * addCaseToTrialSessionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.calendarNotes notes for why the trial session/hearing was added
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise} the promise of the addCaseToTrialSessionInteractor call
 */
exports.addCaseToTrialSessionInteractor = async ({
  applicationContext,
  calendarNotes,
  docketNumber,
  trialSessionId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const caseDetails = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseDetails, { applicationContext });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (caseEntity.isCalendared()) {
    throw new Error('The case is already calendared');
  }

  if (trialSessionEntity.isCaseAlreadyCalendared(caseEntity)) {
    throw new Error('The case is already part of this trial session.');
  }

  trialSessionEntity
    .deleteCaseFromCalendar({ docketNumber: caseEntity.docketNumber }) // we delete because it might have been manually removed
    .manuallyAddCaseToCalendar({ calendarNotes, caseEntity });

  caseEntity.setAsCalendared(trialSessionEntity);

  await applicationContext
    .getPersistenceGateway()
    .deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
    });

  if (trialSessionEntity.isCalendared) {
    await applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
      highPriority: true,
      trialDate: caseEntity.trialDate,
    });
  }

  const updatedCase = await applicationContext
    .getPersistenceGateway()
    .updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
