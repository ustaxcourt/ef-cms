const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { copyPagesFromPdf } = require('../../utilities/copyPagesFromPdf');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * Generates notices for all calendared cases for the given trialSessionId
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.docketNumber optional docketNumber to explicitly set the notice on the ONE specified case
 */
exports.setNoticesForCalendaredTrialSessionInteractor = async (
  applicationContext,
  { docketNumber, trialSessionId },
) => {
  let shouldSetNoticesIssued = true;
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

  // opting to pull from the set of calendared cases rather than load the
  // case individually to add an additional layer of validation
  // TODO: check for the necessity of the extra validation
  // if (docketNumber) {
  //   Do not set when sending notices for a single case
  //   shouldSetNoticesIssued = false;

  //   const singleCase = calendaredCases.find(
  //     caseRecord => caseRecord.docketNumber === docketNumber,
  //   );

  //   calendaredCases = [singleCase];
  // }

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

  for (let calendaredCase of calendaredCases) {
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
          applicationContext.logger.error(err);
        }
      },
    );
  }

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

  // Prevent from being overwritten when generating notices for a manually-added
  // case, after the session has been set (see above)
  if (shouldSetNoticesIssued) {
    await trialSessionEntity.setNoticesIssued();

    await applicationContext.getPersistenceGateway().updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });
  }

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
