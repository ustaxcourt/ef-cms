import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';

export const generateTrialSessionPaperServicePdfInteractor = async (
  applicationContext: IApplicationContext,
  {
    trialNoticePdfsKeys,
    trialSessionId,
  }: { trialNoticePdfsKeys: string[]; trialSessionId: string },
): Promise<void> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServiceDocumentsPdf = await PDFDocument.create();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'paper_service_started',
      totalPdfs: trialNoticePdfsKeys.length,
    },
    userId: user.userId,
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
      message: {
        action: 'paper_service_updated',
        pdfsAppended,
      },
      userId: user.userId,
    });
  }

  const hasPaper = !!paperServiceDocumentsPdf.getPageCount();
  const paperServicePdfData = await paperServiceDocumentsPdf.save();

  let docketEntryId, pdfUrl;

  if (hasPaper) {
    ({ fileId: docketEntryId, url: pdfUrl } = await applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl({
        applicationContext,
        file: paperServicePdfData,
        useTempBucket: true,
      }));

    const trialSession = await applicationContext
      .getPersistenceGateway()
      .getTrialSessionById({
        applicationContext,
        trialSessionId,
      });

    const trialSessionEntity = new TrialSession(trialSession, {
      applicationContext,
    });

    trialSessionEntity.addPaperServicePdf(docketEntryId, 'Initial Calendaring');

    await applicationContext.getPersistenceGateway().updateTrialSession({
      applicationContext,
      trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
    });

    applicationContext.logger.info(
      `generated the printable paper service pdf at ${pdfUrl}`,
      { pdfUrl },
    );
  }

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'paper_service_complete',
      docketEntryId,
      hasPaper,
      pdfUrl,
    },
    userId: user.userId,
  });
};
