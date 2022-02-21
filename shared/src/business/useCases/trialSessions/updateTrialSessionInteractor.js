const DocketEntry = require('../../entities/DocketEntry');
const {
  CASE_STATUS_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const {
  TrialSessionWorkingCopy,
} = require('../../entities/trialSessions/TrialSessionWorkingCopy');
const { Case } = require('../../entities/cases/Case');
const { get } = require('lodash');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

const generateNorpIfRequired = async ({
  applicationContext,
  caseEntity,
  currentTrialSession,
  newTrialSessionEntity,
}) => {
  const shouldIssueNoticeOfChangeToRemoteProceeding =
    currentTrialSession.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
    newTrialSessionEntity.proceedingType ===
      TRIAL_SESSION_PROCEEDING_TYPES.remote &&
    caseEntity.status !== CASE_STATUS_TYPES.closed;

  console.log(
    `Case number ${caseEntity.docketNumber} should be notified? ${shouldIssueNoticeOfChangeToRemoteProceeding}`,
  );
  if (shouldIssueNoticeOfChangeToRemoteProceeding) {
    const trialSessionInformation = {
      joinPhoneNumber: newTrialSessionEntity.joinPhoneNumber,
      judgeName: newTrialSessionEntity.judge.name,
      meetingId: newTrialSessionEntity.meetingId,
      password: newTrialSessionEntity.password,
      startDate: newTrialSessionEntity.startDate,
      startTime: newTrialSessionEntity.startTime,
      trialLocation: newTrialSessionEntity.trialLocation,
    };

    await applicationContext
      .getUseCases()
      .generateNoticeOfChangeToRemoteProceedingInteractor(applicationContext, {
        docketNumber: caseEntity.docketNumber,
        trialSessionInformation,
      });

    //fixme create  SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding

    const noticeOfChangeToRemoteProceedingDocketEntry = new DocketEntry(
      {
        date: newTrialSessionEntity.startDate,
        docketEntryId: newNoticeOfTrialIssuedDocketEntryId,
        documentTitle:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding
            .documentTitle,
        documentType:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding
            .documentType,
        eventCode:
          SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeToRemoteProceeding
            .eventCode,
        isFileAttached: true,
        isOnDocketRecord: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        signedAt: applicationContext.getUtilities().createISODateString(), // The signature is in the template of the document being generated
        trialLocation: newTrialSessionEntity.trialLocation,
        userId: user.userId,
      },
      { applicationContext },
    );

    noticeOfChangeToRemoteProceedingDocketEntry.numberOfPages =
      await applicationContext.getUseCaseHelpers().countPagesInDocument({
        applicationContext,
        docketEntryId:
          noticeOfChangeToRemoteProceedingDocketEntry.docketEntryId,
      });

    caseEntity.addDocketEntry(noticeOfChangeToRemoteProceedingDocketEntry);

    //add docket entry
    // caseEntity.addDocketEntry();

    return caseEntity;
  }
};

/**
 * updateTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {object} the created trial session
 */
exports.updateTrialSessionInteractor = async (
  applicationContext,
  { trialSession },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const currentTrialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: trialSession.trialSessionId,
    });

  if (
    currentTrialSession.startDate <
    applicationContext.getUtilities().createISODateString()
  ) {
    throw new Error('Trial session cannot be updated after its start date');
  }

  const editableFields = {
    address1: trialSession.address1,
    address2: trialSession.address2,
    chambersPhoneNumber: trialSession.chambersPhoneNumber,
    city: trialSession.city,
    courtReporter: trialSession.courtReporter,
    courthouseName: trialSession.courthouseName,
    irsCalendarAdministrator: trialSession.irsCalendarAdministrator,
    joinPhoneNumber: trialSession.joinPhoneNumber,
    judge: trialSession.judge,
    maxCases: trialSession.maxCases,
    meetingId: trialSession.meetingId,
    notes: trialSession.notes,
    password: trialSession.password,
    postalCode: trialSession.postalCode,
    proceedingType: trialSession.proceedingType,
    sessionType: trialSession.sessionType,
    startDate: trialSession.startDate,
    startTime: trialSession.startTime,
    state: trialSession.state,
    swingSession: trialSession.swingSession,
    swingSessionId: trialSession.swingSessionId,
    term: trialSession.term,
    termYear: trialSession.termYear,
    trialClerk: trialSession.trialClerk,
    trialLocation: trialSession.trialLocation,
  };

  const newTrialSessionEntity = new TrialSession(
    { ...currentTrialSession, ...editableFields },
    {
      applicationContext,
    },
  );

  if (
    (!get(currentTrialSession, 'judge.userId') &&
      get(newTrialSessionEntity, 'judge.userId')) ||
    (currentTrialSession.judge &&
      newTrialSessionEntity.judge &&
      currentTrialSession.judge.userId !== newTrialSessionEntity.judge.userId)
  ) {
    //create a working copy for the new judge
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
      trialSessionId: newTrialSessionEntity.trialSessionId,
      userId: newTrialSessionEntity.judge.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .createTrialSessionWorkingCopy({
        applicationContext,
        trialSessionWorkingCopy: trialSessionWorkingCopyEntity
          .validate()
          .toRawObject(),
      });
  }

  if (
    (!get(currentTrialSession, 'trialClerk.userId') &&
      get(newTrialSessionEntity, 'trialClerk.userId')) ||
    (currentTrialSession.trialClerk &&
      newTrialSessionEntity.trialClerk &&
      currentTrialSession.trialClerk.userId !==
        newTrialSessionEntity.trialClerk.userId)
  ) {
    //create a working copy for the new trial clerk
    const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
      trialSessionId: newTrialSessionEntity.trialSessionId,
      userId: newTrialSessionEntity.trialClerk.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .createTrialSessionWorkingCopy({
        applicationContext,
        trialSessionWorkingCopy: trialSessionWorkingCopyEntity
          .validate()
          .toRawObject(),
      });
  }

  if (currentTrialSession.caseOrder && currentTrialSession.caseOrder.length) {
    //update all the cases that are calendared with the new trial information
    const calendaredCases = currentTrialSession.caseOrder;

    for (let calendaredCase of calendaredCases) {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: calendaredCase.docketNumber,
        });

      let caseEntity = new Case(caseToUpdate, { applicationContext });
      if (
        caseToUpdate.trialSessionId === newTrialSessionEntity.trialSessionId
      ) {
        console.log('Trial session to update is the one we want.');

        caseEntity = await generateNorpIfRequired({
          applicationContext,
          caseEntity,
          currentTrialSession,
          newTrialSessionEntity,
        });

        caseEntity.updateTrialSessionInformation(newTrialSessionEntity);

        await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        });
      } else {
        console.log('Trial session to update is NOT the one we want.');
      }

      const matchingHearing = caseToUpdate.hearings.find(
        hearing =>
          hearing.trialSessionId == newTrialSessionEntity.trialSessionId,
      );
      if (matchingHearing) {
        applicationContext.getPersistenceGateway().updateCaseHearing({
          applicationContext,
          docketNumber: calendaredCase.docketNumber,
          hearingToUpdate: newTrialSessionEntity.validate().toRawObject(),
        });
      }
    }
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: newTrialSessionEntity.validate().toRawObject(),
  });

  return newTrialSessionEntity.toRawObject();
};
