import { state } from 'cerebral';

/**
 * redirects to the draft documents page
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {object} object with a path
 */
export const skipSigningOrderAction = ({ get, store }) => {
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

  const { docketNumber, documents } = get(state.caseDetail);
  const documentId = get(state.documentId);
  const order = documents.find(d => d.documentId === documentId);

  return {
    alertSuccess: {
      message: `${order.documentTitle || order.documentType} updated.`,
    },
    path: `/case-detail/${docketNumber}/draft-documents`,
  };
};
