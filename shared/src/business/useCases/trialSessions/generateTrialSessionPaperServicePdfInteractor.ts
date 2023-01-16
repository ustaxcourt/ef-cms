import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
/**
 * generateTrialSessionPaperServicePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {string} trial session calendar pdf url
 */
export const generateTrialSessionPaperServicePdfInteractor = async (
  applicationContext: IApplicationContext,
  { trialNoticePdfsKeysArray }: { trialNoticePdfsKeysArray: string[] },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServiceDocumentsPdf = await PDFDocument.create();

  for (let index = 0; index < trialNoticePdfsKeysArray.length; index++) {
    const calendaredCasePdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: trialNoticePdfsKeysArray[index],
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

  if (url) {
    applicationContext.logger.info(
      `generated the printable paper service pdf at ${url}`,
      {
        url,
      },
    );
  }

  return { docketEntryId, hasPaper, pdfUrl: url || null };
};
