import { state } from 'cerebral';

/**
 * documentSigningHelper
 *
 * @param {*} get cerebral get function
 * @returns {object} object of document signature helper properties
 */
export const documentSigningHelper = get => {
  const signatureData = get(state.pdfForSigning.signatureData);
  const currentPageNumber = get(state.pdfForSigning.pageNumber);
  const totalPages = get(state.pdfForSigning.pdfjsObj.numPages);
  const disablePrevious = currentPageNumber === 1 || !!signatureData;
  const disableNext = currentPageNumber === totalPages || !!signatureData;
  const previousPageNumber =
    currentPageNumber === 1 ? 1 : currentPageNumber - 1;
  const nextPageNumber =
    currentPageNumber === totalPages ? totalPages : currentPageNumber + 1;

  return {
    disableNext,
    disablePrevious,
    nextPageNumber,
    previousPageNumber,
    totalPages,
  };
};
