const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { chunk } = require('lodash');
const { copyPagesFromPdf } = require('../../utilities/copyPagesFromPdf');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

// Due to SES limits, this MUST be lower than 14, so 10 is hopefully a safe number
const CHUNK_SIZE = 10;
const TIME_BETWEEN_BATCHES = 1000;

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

  const jobId = applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().createJobStatus({
    applicationContext,
    docketNumbers: calendaredCases.map(
      calendaredCase => calendaredCase.docketNumber,
    ),
    jobId,
  });

  // due to SES emails per second limits, we can't invoke lambdas at a quick
  // rate or else SES emails will begin to fail due to throttling.
  const batches = chunk(calendaredCases, CHUNK_SIZE);
  const requests = Promise.resolve();

  for (const batch of batches) {
    requests.then(
      () =>
        new Promise(resolve => {
          batch.map(calendaredCase =>
            applicationContext.invokeLambda(
              {
                FunctionName: `set_trial_session_${process.env.STAGE}_${process.env.CURRENT_COLOR}`,
                InvocationType: 'Event',
                Payload: JSON.stringify({
                  docketNumber: calendaredCase.docketNumber,
                  jobId,
                  trialSession,
                  userId: user.userId,
                }),
              },
              err => {
                if (err) {
                  // TODO: thing of error condition
                  applicationContext.logger.error(err);
                }
              },
            ),
          );
          setTimeout(resolve, TIME_BETWEEN_BATCHES);
        }),
    );
  }

  await requests;

  await new Promise(resolve => {
    const interval = setInterval(async () => {
      const jobStatus = await applicationContext
        .getPersistenceGateway()
        .getJobStatus({
          applicationContext,
          jobId,
        });
      if (jobStatus.unfinishedCases === 0) {
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

  const newPdfDoc = await PDFDocument.create();

  for (let calendaredCase of calendaredCases) {
    const pdfExistsInS3 = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        key: `${jobId}-${calendaredCase.docketNumber}`,
        useTempBucket: true,
      });

    if (!pdfExistsInS3) {
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

    await copyPagesFromPdf({
      copyFrom: calendaredCasePdf,
      copyInto: newPdfDoc,
    });
  }

  let pdfUrl = null;
  const serviceInfo = await applicationContext
    .getUseCaseHelpers()
    .savePaperServicePdf({
      applicationContext,
      document: newPdfDoc,
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
};
