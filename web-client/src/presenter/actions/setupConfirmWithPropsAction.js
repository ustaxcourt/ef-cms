import { state } from 'cerebral';

/**
 * @returns {Promise} async action
 */
export const setupConfirmWithPropsAction = async ({ get }) => {
  const caseId = get(state.modal.caseId);
  const documentIdToEdit = get(state.modal.documentIdToEdit);
  const docketNumber = get(state.modal.docketNumber);
  const parentMessageId = get(state.modal.parentMessageId);
  const redirectUrl = get(state.redirectUrl);

  return {
    caseId,
    docketNumber,
    documentIdToEdit,
    parentMessageId,
    redirectUrl,
  };
};
