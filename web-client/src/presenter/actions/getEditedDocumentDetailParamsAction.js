import { state } from 'cerebral';

/**
 * Gets the caseId and documentId from current state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the caseId and documentId
 */
export const getEditedDocumentDetailParamsAction = async ({ get }) => {
  const caseDetail = get(state.caseDetail);
  const documentDetail = get(state.documentToEdit);

  return {
    caseId: caseDetail.caseId,
    documentId: documentDetail.documentId,
  };
};
