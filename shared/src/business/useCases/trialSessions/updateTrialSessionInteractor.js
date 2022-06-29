const {
  CASE_STATUS_TYPES,
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

const updateAssociatedCaseAndSetNoticeOfChange = async ({
  applicationContext,
  currentTrialSession,
  docketNumber,
  paperServicePdfsCombined,
  updatedTrialSessionEntity,
  userId,
}) => {
  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });
  if (
    caseToUpdate.trialSessionId === updatedTrialSessionEntity.trialSessionId
  ) {
    const shouldSetNoticeOfChangeToRemoteProceeding =
      currentTrialSession.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
      updatedTrialSessionEntity.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.remote &&
      updatedTrialSessionEntity.isCalendared &&
      caseEntity.status !== CASE_STATUS_TYPES.closed;

    if (shouldSetNoticeOfChangeToRemoteProceeding) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeToRemoteProceeding(applicationContext, {
          caseEntity,
          currentTrialSession,
          newPdfDoc: paperServicePdfsCombined,
          newTrialSessionEntity: updatedTrialSessionEntity,
          user: applicationContext.getCurrentUser(),
        });
    }

    const shouldSetNoticeOfChangeToInPersonProceeding =
      currentTrialSession.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.remote &&
      updatedTrialSessionEntity.proceedingType ===
        TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
      updatedTrialSessionEntity.isCalendared &&
      caseEntity.status !== CASE_STATUS_TYPES.closed;

    if (shouldSetNoticeOfChangeToInPersonProceeding) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeToInPersonProceeding(applicationContext, {
          caseEntity,
          currentTrialSession,
          newPdfDoc: paperServicePdfsCombined,
          newTrialSessionEntity: updatedTrialSessionEntity,
          user: applicationContext.getCurrentUser(),
        });
    }

    const shouldIssueNoticeOfChangeOfTrialJudge =
      currentTrialSession.isCalendared &&
      currentTrialSession.judge?.userId !==
        updatedTrialSessionEntity.judge?.userId &&
      caseEntity.status !== CASE_STATUS_TYPES.closed;

    if (shouldIssueNoticeOfChangeOfTrialJudge) {
      await applicationContext
        .getUseCaseHelpers()
        .setNoticeOfChangeOfTrialJudge(applicationContext, {
          caseEntity,
          currentTrialSession,
          newPdfDoc: paperServicePdfsCombined,
          newTrialSessionEntity: updatedTrialSessionEntity,
          userId,
        });
    }

    caseEntity.updateTrialSessionInformation(updatedTrialSessionEntity);

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });
  }

  const matchingHearing = caseToUpdate.hearings.find(
    hearing =>
      hearing.trialSessionId == updatedTrialSessionEntity.trialSessionId,
  );
  if (matchingHearing) {
    applicationContext.getPersistenceGateway().updateCaseHearing({
      applicationContext,
      docketNumber,
      hearingToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
    });
  }
};

const createWorkingCopyForNewUserOnSession = async ({
  applicationContext,
  trialSessionId,
  userId,
}) => {
  const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
    trialSessionId,
    userId,
  });

  await applicationContext
    .getPersistenceGateway()
    .createTrialSessionWorkingCopy({
      applicationContext,
      trialSessionWorkingCopy: trialSessionWorkingCopyEntity
        .validate()
        .toRawObject(),
    });
};

/**
 * updateTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
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
    estimatedEndDate: trialSession.estimatedEndDate,
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

  const updatedTrialSessionEntity = new TrialSession(
    { ...currentTrialSession, ...editableFields },
    {
      applicationContext,
    },
  );

  const shouldCreateWorkingCopyForNewJudge =
    (!get(currentTrialSession, 'judge.userId') &&
      get(updatedTrialSessionEntity, 'judge.userId')) ||
    (currentTrialSession.judge &&
      updatedTrialSessionEntity.judge &&
      currentTrialSession.judge.userId !==
        updatedTrialSessionEntity.judge.userId);

  if (shouldCreateWorkingCopyForNewJudge) {
    await createWorkingCopyForNewUserOnSession({
      applicationContext,
      trialSessionId: updatedTrialSessionEntity.trialSessionId,
      userId: updatedTrialSessionEntity.judge.userId,
    });
  }

  const shouldCreateWorkingCopyForNewTrialClerk =
    (!get(currentTrialSession, 'trialClerk.userId') &&
      get(updatedTrialSessionEntity, 'trialClerk.userId')) ||
    (currentTrialSession.trialClerk &&
      updatedTrialSessionEntity.trialClerk &&
      currentTrialSession.trialClerk.userId !==
        updatedTrialSessionEntity.trialClerk.userId);

  if (shouldCreateWorkingCopyForNewTrialClerk) {
    await createWorkingCopyForNewUserOnSession({
      applicationContext,
      trialSessionId: updatedTrialSessionEntity.trialSessionId,
      userId: updatedTrialSessionEntity.trialClerk.userId,
    });
  }

  let pdfUrl = null;
  let serviceInfo = null;
  if (currentTrialSession.caseOrder && currentTrialSession.caseOrder.length) {
    const calendaredCases = currentTrialSession.caseOrder.filter(
      c => !c.removedFromTrial,
    );
    const { PDFDocument } = await applicationContext.getPdfLib();
    const paperServicePdfsCombined = await PDFDocument.create();

    for (let calendaredCase of calendaredCases) {
      await updateAssociatedCaseAndSetNoticeOfChange({
        applicationContext,
        currentTrialSession,
        docketNumber: calendaredCase.docketNumber,
        paperServicePdfsCombined,
        updatedTrialSessionEntity,
        userId: user.userId,
      });
    }

    serviceInfo = await applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf({
        applicationContext,
        document: paperServicePdfsCombined,
      });
    pdfUrl = serviceInfo.url;
  }

  if (trialSession.swingSession && trialSession.swingSessionId) {
    updatedTrialSessionEntity.setAsSwingSession(trialSession.swingSessionId);
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: updatedTrialSessionEntity.validate().toRawObject(),
  });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'update_trial_session_complete',
      hasPaper: serviceInfo?.hasPaper,
      pdfUrl,
      trialSessionId: trialSession.trialSessionId,
    },
    userId: user.userId,
  });
};
