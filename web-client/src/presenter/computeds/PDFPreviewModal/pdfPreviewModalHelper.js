import { state } from 'cerebral';

export const pdfPreviewModalHelper = get => {
  const currentPage = get(state.modal.pdfPreviewModal.currentPage);
  const error = get(state.modal.pdfPreviewModal.error);
  const totalPages = get(state.modal.pdfPreviewModal.totalPages);

  return {
    disableLeftButtons: currentPage === 1,
    disableRightButtons: currentPage === totalPages,
    displayErrorText: !!error,
  };
};
