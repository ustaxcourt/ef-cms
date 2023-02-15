import { state } from 'cerebral';

/**
 * generates a PDF from the currently scanned images / batches
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting state
 * @param {object} providers.store the cerebral store used for setting scan state
 * @returns {Promise} async action -> { file }
 */

export const generatePdfFromScanSessionAction = async ({
  applicationContext,
  get,
}) => {
  // wait a bit so that the spinner shows up because generatePDFFromJPGDataInteractor blocks the browser
  await new Promise(resolve => setTimeout(resolve, 100));
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );

  const batches = get(state.scanner.batches[documentSelectedForScan]);

  const imgData = [];
  batches.forEach(batch => batch.pages.forEach(page => imgData.push(page)));

  // this blocks the browser
  const pdfBlob = await applicationContext
    .getUseCases()
    .generatePDFFromJPGDataInteractor(applicationContext, { imgData });

  const file = new File([pdfBlob], 'myfile.pdf', {
    type: 'application/pdf',
  });

  return { file };
};
