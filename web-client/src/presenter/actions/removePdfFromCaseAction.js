import { state } from 'cerebral';

/**
 * Removes a document from state.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new documentUploadMode
 *
 */
export const removePdfFromCaseAction = async ({ get }) => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);

  const documents = get(caseDetail.documents);

  documents.some((document, idx) => {
    if (document.documentId === documentId) {
      documents.splice(idx, 1);
      return true;
    }
  });

  // TODO: Chat with Kristen about this
  // const documentToRemove = caseDetail.documents.find(
  //   document => document.documentId === documentId,
  // );

  // const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

  // Update necessary case detail based on the removed document
  // switch (documentToRemove.eventCode) {
  //   case INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode:
  //     caseDetail.preferredTrialCity = '';
  //     caseDetail.orderDesignatingPlaceOfTrial = true;
  //     break;
  // }

  return {
    caseDetail,
    documentUploadMode: 'scan',
  };
};
