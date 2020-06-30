import { state } from 'cerebral';

/**
 * set the success message in props for successful document signing
 *
 * @param {object} params the params object
 * @param {object} params.get the cerebral get function
 * @returns {object} the props with the message
 */
export const setSuccessFromDocumentTitleAction = ({ get }) => {
  const { documents } = get(state.caseDetail);
  const documentId = get(state.documentId);
  const order = documents.find(d => d.documentId === documentId);
  return {
    alertSuccess: {
      message: `${order.documentTitle || order.documentType} updated.`,
    },
  };
};
