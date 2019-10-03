import { state } from 'cerebral';

/**
 * @returns {Promise} async action
 */
export const setupConfirmWithPropsAction = async ({ get }) => {
  const caseId = get(state.caseDetail.caseId);
  const documentIdToEdit = get(state.documentIdToEdit);
  const docketNumber = get(state.caseDetail.docketNumber);
  return {
    caseId,
    docketNumber,
    documentIdToEdit,
  };
};
