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
 * @param {object} providers.calendarNotes notes for why the trial session/hearing was added
 * @param {string} providers.trialSessionId the id of the trial session
 * @param {string} providers.docketNumber the docket number of the case
 * @param {boolean} providers.isHearing if the trial session is a hearing or not
 * @returns {Promise} the promise of the addCaseToTrialSessionInteractor call
 */
exports.addCaseToTrialSessionInteractor = async ({
  applicationContext,
  calendarNotes,
  docketNumber,
  isHearing,
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

  if (trialSessionEntity.isCaseAlreadyCalendared(caseEntity)) {
    throw new Error('The case is already part of this trial session.');
  }

  let updatedCase;

  if (!isHearing) {
    if (caseEntity.isCalendared()) {
      throw new Error('The case is already calendared');
    }

    trialSessionEntity
      .deleteCaseFromCalendar({ docketNumber: caseEntity.docketNumber }) // we delete because it might have been manually removed
      .manuallyAddCaseToCalendar(caseEntity, calendarNotes);

    caseEntity.setAsCalendared(trialSessionEntity);

    await applicationContext
      .getPersistenceGateway()
      .deleteCaseTrialSortMappingRecords({
        applicationContext,
        docketNumber: caseEntity.docketNumber,
      });

    if (trialSessionEntity.isCalendared) {
      await applicationContext
        .getPersistenceGateway()
        .setPriorityOnAllWorkItems({
          applicationContext,
          docketNumber: caseEntity.docketNumber,
          highPriority: true,
          trialDate: caseEntity.trialDate,
        });
    }

    updatedCase = await applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    });
  } else {
    if (!caseEntity.isCalendared()) {
      throw new Error('The Case must be calendared to add a hearing');
    }

    trialSessionEntity
      .deleteCaseFromCalendar({ docketNumber: caseEntity.docketNumber }) // we delete because it might have been manually removed
      .manuallyAddCaseToCalendar(caseEntity, calendarNotes);

    await applicationContext.getPersistenceGateway().addHearingToCase({
      applicationContext,
      docketNumber,
      trialSession: trialSessionEntity.validate().toRawObject(),
    });

    // retrieve the case again since we've added the mapped hearing record :)
    updatedCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
