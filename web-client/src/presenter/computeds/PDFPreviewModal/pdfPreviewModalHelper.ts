import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const pdfPreviewModalHelper = (get: Get): any => {
  const currentPage = get(state.modal.pdfPreviewModal.currentPage);
  const error = get(state.modal.pdfPreviewModal.error);
  const totalPages = get(state.modal.pdfPreviewModal.totalPages);

  return {
    disableLeftButtons: currentPage === 1,
    disableRightButtons: currentPage === totalPages,
    displayErrorText: !!error,
  };
};
