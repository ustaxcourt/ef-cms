import { state } from 'cerebral';

/**
 * Sets the current page to display in the pdf preview modal.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {Function} providers.props the cerebral props object
 */
export const setPageAction = async ({ get, props, store }) => {
  let desiredPage = 1;
  if (props.currentPage !== undefined) {
    desiredPage = props.currentPage;
  }

  const actualPage = Math.min(
    Math.max(1, desiredPage),
    get(state.modal.pdfPreviewModal.totalPages),
  );
  store.set(state.modal.pdfPreviewModal.currentPage, actualPage);

  const { ctx, pdfDoc } = get(state.modal.pdfPreviewModal);

  const page = await pdfDoc.getPage(actualPage);

  const viewport = page.getViewport({
    scale: 2,
  });

  store.set(state.modal.pdfPreviewModal.width, viewport.width);
  store.set(state.modal.pdfPreviewModal.height, viewport.height);

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };

  page.cleanup();
  page.render(renderContext);
};
