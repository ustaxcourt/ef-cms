import { state } from 'cerebral';

/**
 * redirects to the draft documents page
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 *
 * @returns object with a path
 */
export const skipSigningOrderAction = ({ get }) => {
  const { caseId, documents } = get(state.caseDetail);
  const documentId = get(state.documentId);
  const order = documents.find(d => d.documentId === documentId);

  return {
    alertSuccess: {
      message: `${order.documentTitle} updated.`,
    },
    path: `/case-detail/${caseId}/draft-documents`,
  };
};
