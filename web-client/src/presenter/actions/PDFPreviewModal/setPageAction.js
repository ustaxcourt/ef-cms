import { state } from 'cerebral';

/**
 * Sets the current page to display in the pdf preview modal.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {Function} providers.props the cerebral props object
 */
export const setPageAction = async ({
  //applicationContext,
  get,
  props,
  store,
}) => {
  //const { PDFDocument } = await applicationContext.getPdfLib();

  let desiredPage = 1;
  if (props.currentPage !== undefined) {
    desiredPage = props.currentPage;
  }

  const actualPage = Math.min(
    Math.max(1, desiredPage),
    get(state.modal.pdfPreviewModal.totalPages),
  );
  store.set(state.modal.pdfPreviewModal.currentPage, actualPage);

  const { pdfDoc } = get(state.modal.pdfPreviewModal);

  // const pdfToDisplay = await PDFDocument.create();

  // const actualPageIndex = actualPage - 1;
  // const [copiedPageToDisplay] = await pdfToDisplay.copyPages(pdfDoc, [
  //   actualPageIndex,
  // ]);

  // pdfToDisplay.addPage(copiedPageToDisplay);

  // const pdfDataUri = await pdfToDisplay.saveAsBase64({ dataUri: true });

  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
  store.set(state.pdfPreviewUrl, pdfDataUri);
};
