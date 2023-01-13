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
  { calendaredCasePdfDataArray }: { calendaredCasePdfDataArray: any[] },
) => {
  console.log(
    '********* calendaredCasePdfDataArray in genInteractor',
    calendaredCasePdfDataArray,
  );
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { PDFDocument } = await applicationContext.getPdfLib();
  const paperServiceDocumentsPdf = await PDFDocument.create();

  console.log(
    'calendaredCasePdfDataArray in genInteractor',
    calendaredCasePdfDataArray,
  );
  for (let index = 0; index < calendaredCasePdfDataArray.length; index++) {
    const calendaredCasePdf = await PDFDocument.load(
      calendaredCasePdfDataArray[index].data,
    );

    await applicationContext.getUtilities().copyPagesAndAppendToTargetPdf({
      copyFrom: calendaredCasePdf,
      copyInto: paperServiceDocumentsPdf,
    });
    console.log('1 paperServiceDocumentsPdf', paperServiceDocumentsPdf);
  }

  console.log('2 paperServiceDocumentsPdf', paperServiceDocumentsPdf);

  const { docketEntryId, hasPaper, url } = await applicationContext
    .getUseCaseHelpers()
    .savePaperServicePdf({
      applicationContext,
      document: paperServiceDocumentsPdf,
    });

  console.log('url', url);

  if (url) {
    applicationContext.logger.info(
      `generated the printable paper service pdf at ${url}`,
      {
        url,
      },
    );
  }

  return { docketEntryId, hasPaper, url };
};
