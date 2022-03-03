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

  let pdfUrl = null;
  if (currentTrialSession.caseOrder && currentTrialSession.caseOrder.length) {
    const calendaredCases = currentTrialSession.caseOrder;
    const { PDFDocument } = await applicationContext.getPdfLib();
    const paperServicePdfsCombined = await PDFDocument.create();
    let processedCases = 0;

    for (let calendaredCase of calendaredCases) {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber: calendaredCase.docketNumber,
        });

      const caseEntity = new Case(caseToUpdate, { applicationContext });
      if (
        caseToUpdate.trialSessionId === newTrialSessionEntity.trialSessionId
      ) {
        await applicationContext
          .getUseCaseHelpers()
          .setNoticeOfChangeToRemoteProceeding(applicationContext, {
            PDFDocument,
            caseEntity,
            currentTrialSession,
            newPdfDoc: paperServicePdfsCombined,
            newTrialSessionEntity,
            user,
          });

        processedCases++;

        await applicationContext
          .getNotificationGateway()
          .sendNotificationToUser({
            applicationContext,
            message: {
              action: 'notice_generation_update_progress',
              processedCases,
              totalCases: calendaredCases.length,
            },
            userId: user.userId,
          });
        caseEntity.updateTrialSessionInformation(newTrialSessionEntity);

        await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
          applicationContext,
          caseToUpdate: caseEntity,
        });
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

    const serviceInfo = await applicationContext
      .getUseCaseHelpers()
      .savePaperServicePdf({
        applicationContext,
        document: paperServicePdfsCombined,
      });
    pdfUrl = serviceInfo.url;

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'notice_generation_complete',
        docketEntryId: serviceInfo.docketEntryId,
        hasPaper: serviceInfo.hasPaper,
        pdfUrl,
      },
      userId: user.userId,
    });
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: newTrialSessionEntity.validate().toRawObject(),
  });

  return {
    newTrialSession: newTrialSessionEntity.toRawObject(),
    serviceInfo: pdfUrl,
  };
};
