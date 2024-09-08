import { NotFoundError } from '../../../errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const generateTrialSessionPaperServicePdfInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    trialNoticePdfsKeys,
    trialSessionId,
  }: {
    trialNoticePdfsKeys: string[];
    trialSessionId: string;
    clientConnectionId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServiceDocumentsPdf = await PDFDocument.create();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'paper_service_started',
      totalPdfs: trialNoticePdfsKeys.length,
    },
    userId: authorizedUser.userId,
  });

  let pdfsAppended = 0;

  for (const trialNoticePdfsKey of trialNoticePdfsKeys) {
    const calendaredCasePdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: trialNoticePdfsKey,
        useTempBucket: true,
      });

    const calendaredCasePdf = await PDFDocument.load(calendaredCasePdfData);

    await applicationContext.getUtilities().copyPagesAndAppendToTargetPdf({
      copyFrom: calendaredCasePdf,
      copyInto: paperServiceDocumentsPdf,
    });

    pdfsAppended++;

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'paper_service_updated',
        pdfsAppended,
      },
      userId: authorizedUser.userId,
    });
  }

  const paperServicePdfData = await paperServiceDocumentsPdf.save();

  let fileId, pdfUrl;

  ({ fileId, url: pdfUrl } = await applicationContext
    .getUseCaseHelpers()
    .saveFileAndGenerateUrl({
      applicationContext,
      file: paperServicePdfData,
      fileNamePrefix: 'paper-service-pdf/',
    }));

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!trialSession) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const trialSessionEntity = new TrialSession(trialSession);

  trialSessionEntity.addPaperServicePdf(fileId, 'Initial Calendaring');

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });

  applicationContext.logger.info(
    `generated the printable paper service pdf at ${pdfUrl}`,
    { pdfUrl },
  );

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'set_trial_calendar_paper_service_complete',
      fileId,
      hasPaper: true,
      pdfUrl,
    },
    userId: authorizedUser.userId,
  });
};
