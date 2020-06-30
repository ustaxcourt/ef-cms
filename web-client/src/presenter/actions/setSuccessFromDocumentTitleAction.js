import { state } from 'cerebral';

/**
 * set the success message in props for successful document signing
 *
 * @param {object} params the params object
 * @param {Function} params.get the cerebral get function
 * @param {object} params.store the cerebral store
 * @returns {object} the props with the message
 */
export const setSuccessFromDocumentTitleAction = ({ get, store }) => {
  const isCreatingOrder = get(state.isCreatingOrder);
  if (isCreatingOrder) {
    store.unset(state.isCreatingOrder);
    return {
      alertSuccess: {
        message:
          'Your document has been successfully created and attached to this message',
      },
    };
  }

  const { documents } = get(state.caseDetail);
  const documentId = get(state.documentId);
  const order = documents.find(d => d.documentId === documentId);
  return {
    alertSuccess: {
      message: `${order.documentTitle || order.documentType} updated.`,
    },
  };
};
