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
  const { caseId } = get(state.caseDetail);
  return {
    alertSuccess: {
      message: 'Document saved.',
    },
    path: `/case-detail/${caseId}/draft-documents`,
  };
};
