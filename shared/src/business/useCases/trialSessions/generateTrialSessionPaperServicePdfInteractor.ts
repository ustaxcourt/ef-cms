import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

// eslint-disable-next-line spellcheck/spell-checker
/**
 * generateTrialSessionPaperServicePdfInteractor
 *
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
