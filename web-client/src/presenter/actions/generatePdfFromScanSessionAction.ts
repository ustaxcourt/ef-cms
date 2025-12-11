import { state } from '@web-client/presenter/app.cerebral';

const PDF_FILENAME = 'scanned-document.pdf';
const PDF_MIME_TYPE = 'application/pdf';

/**
 * generates a PDF from the currently scanned images / batches
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting state
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.store the cerebral store used for setting scan state
 * @returns {Promise} async action -> path.success({ file }) or path.error({ error })
 */

export const generatePdfFromScanSessionAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  // wait a bit so that the spinner shows up because generatePDFFromJPGDataInteractor blocks the browser
  await new Promise(resolve => setTimeout(resolve, 100));
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  )!;
  const batches = get(state.scanner.batches[documentSelectedForScan]);

  if (!batches || batches.length === 0) {
    return path.error({
      error: new Error(
        `No batches found for document type: ${documentSelectedForScan}`,
      ),
    });
  }

  const imgData: Uint8Array[] = [];
  batches.forEach(batch => batch.pages.forEach(page => imgData.push(page)));

  // this blocks the browser
  const pdfBlob = await applicationContext
    .getUseCases()
    .generatePDFFromJPGDataInteractor(applicationContext, { imgData });

  const file = new File([pdfBlob], PDF_FILENAME, {
    type: PDF_MIME_TYPE,
  });

  return path.success({ file });
};
