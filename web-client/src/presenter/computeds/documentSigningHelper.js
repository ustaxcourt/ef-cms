import { state } from 'cerebral';

/**
 * documentSigningHelper
 *
 * @param {*} get cerebral get function
 * @returns {object} object of document signature helper properties
 */
export const documentSigningHelper = get => {
  const signatureApplied = get(state.pdfForSigning.signatureApplied);
  const signatureData = get(state.pdfForSigning.signatureData);
  const currentPageNumber = get(state.pdfForSigning.pageNumber);
  const pdfjsObj = get(state.pdfForSigning.pdfjsObj);
  const totalPages = pdfjsObj.numPages;

  const disablePrevious =
    currentPageNumber === 1 || (!!signatureData || signatureApplied);
  const disableNext =
    currentPageNumber === totalPages || (!!signatureData || signatureApplied);
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
