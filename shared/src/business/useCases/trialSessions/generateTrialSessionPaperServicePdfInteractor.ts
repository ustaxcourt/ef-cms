import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * generateTrialSessionPaperServicePdfInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialNoticePdfsKeys the trialNoticePdfsKeys
 * @returns {object} docketEntryId, hasPaper, pdfUrl
 */
export const generateTrialSessionPaperServicePdfInteractor = async (
  applicationContext: IApplicationContext,
  { trialNoticePdfsKeys }: { trialNoticePdfsKeys: string[] },
) => {
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

  for (let index = 0; index < trialNoticePdfsKeys.length; index++) {
    const calendaredCasePdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: trialNoticePdfsKeys[index],
        protocol: 'S3',
        useTempBucket: true,
      });

    const calendaredCasePdf = await PDFDocument.load(calendaredCasePdfData);

    await applicationContext.getUtilities().copyPagesAndAppendToTargetPdf({
      copyFrom: calendaredCasePdf,
      copyInto: paperServiceDocumentsPdf,
    });

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'paper_service_updated',
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
