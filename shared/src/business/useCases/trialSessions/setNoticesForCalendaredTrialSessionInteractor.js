const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the trial session id
 */
exports.setNoticesForCalendaredTrialSessionInteractor = async (
  applicationContext,
  { trialSessionId },
) => {
  const user = applicationContext.getCurrentUser();
  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let calendaredCases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  if (calendaredCases.length === 0) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'notice_generation_complete',
        hasPaper: false,
      },
      userId: user.userId,
    });

    return;
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

  const trialSessionProcessingStatus = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionProcessingStatus({
      applicationContext,
      trialSessionId,
    });

  if (trialSessionProcessingStatus) {
    // TODO handle notifying user of already existing processing of trial session event
    return;
  }

  await applicationContext
    .getPersistenceGateway()
    .setTrialSessionProcessingStatus({
      applicationContext,
      trialSessionId,
      trialSessionStatus: true,
    });

  const jobId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().createJobStatus({
    applicationContext,
    docketNumbers: calendaredCases.map(
      calendaredCase => calendaredCase.docketNumber,
    ),
    jobId,
  });

  for (let calendaredCase of calendaredCases) {
    await applicationContext
      .getMessageGateway()
      .sendSetTrialSessionCalendarEvent({
        applicationContext,
        payload: {
          docketNumber: calendaredCase.docketNumber,
          jobId: trialSessionId,
          trialSession,
          userId: user.userId,
        },
      });
  }

  await new Promise(resolve => {
    const interval = setInterval(async () => {
      const jobStatus = await applicationContext
        .getPersistenceGateway()
        .getJobStatus({
          applicationContext,
          jobId: trialSessionId,
        });
      if (jobStatus.unfinishedCases === 0) {
        // TASKS/TODOS
        // 1. CHECK FOR ITEMS IN DL
        //    - use trial-session lambda to check for items in DL
        //    - DO WE RE-DUMP IT BACK TO THE ORIGINAL SOURCE QUEUE
        // 2. end TRIAL SESSION PROCESSING (set TO FALSE)
        //  await applicationContext
        // .getPersistenceGateway()
        // .setTrialSessionProcessingStatus({
        //   applicationContext,
        //   trialSessionId,
        //   trialSessionStatus: false,
        // });

        // spin up dynamodb local

        clearInterval(interval);
        resolve();
      }
    }, 5000);
  });

  await trialSessionEntity.setNoticesIssued();

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  const paperServiceDocumentsPdf = await PDFDocument.create();

  for (let calendaredCase of calendaredCases) {
    const casePdfDocumentsExistsInS3 = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        key: `${jobId}-${calendaredCase.docketNumber}`,
        useTempBucket: true,
      });

    if (!casePdfDocumentsExistsInS3) {
      continue;
    }

    const calendaredCasePdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: `${jobId}-${calendaredCase.docketNumber}`,
        protocol: 'S3',
        useTempBucket: true,
      });

    const calendaredCasePdf = await PDFDocument.load(calendaredCasePdfData);

    await applicationContext.getUtilities().copyPagesAndAppendToTargetPdf({
      copyFrom: calendaredCasePdf,
      copyInto: paperServiceDocumentsPdf,
    });
  }

  const { docketEntryId, hasPaper, url } = await applicationContext
    .getUseCaseHelpers()
    .savePaperServicePdf({
      applicationContext,
      document: paperServiceDocumentsPdf,
    });

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'notice_generation_complete',
      docketEntryId,
      hasPaper,
      pdfUrl: url || null,
    },
    userId: user.userId,
  });
};
