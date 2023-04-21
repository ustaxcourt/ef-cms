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

  applicationContext.logger.info(
    'generateTrialSessionPaperServicePdfInteractor start',
    {
      trialNoticePdfsKeys,
    },
  );

  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServiceDocumentsPdf = await PDFDocument.create();

  for (let index = 0; index < trialNoticePdfsKeys.length; index++) {
    applicationContext.logger.info(
      'generateTrialSessionPaperServicePdfInteractor begin stich',
      {
        key: trialNoticePdfsKeys[index],
      },
    );

    const calendaredCasePdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: trialNoticePdfsKeys[index],
        protocol: 'S3',
        useTempBucket: true,
      });

    applicationContext.logger.info(
      'generateTrialSessionPaperServicePdfInteractor data downloaded',
      {
        key: trialNoticePdfsKeys[index],
      },
    );

    const calendaredCasePdf = await PDFDocument.load(calendaredCasePdfData);

    await applicationContext.getUtilities().copyPagesAndAppendToTargetPdf({
      copyFrom: calendaredCasePdf,
      copyInto: paperServiceDocumentsPdf,
    });

    applicationContext.logger.info(
      'generateTrialSessionPaperServicePdfInteractor complete stich',
      {
        key: trialNoticePdfsKeys[index],
      },
    );
  }

  const hasPaper = !!paperServiceDocumentsPdf.getPageCount();
  const paperServicePdfData = await paperServiceDocumentsPdf.save();

  let docketEntryId, pdfUrl;

  if (hasPaper) {
    applicationContext.logger.info(
      'generateTrialSessionPaperServicePdfInteractor saveFileAndGenerateUrl start',
      {
        key: trialNoticePdfsKeys[index],
      },
    );
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

  return { docketEntryId, hasPaper, pdfUrl };
};
