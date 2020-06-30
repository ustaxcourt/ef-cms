import { state } from 'cerebral';

/**
 * sets the props from state for removing signature from a document
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the props needed for removing signature
 */
export const setPropsForRemoveSignatureAction = ({ get }) => {
  const caseDetail = get(state.caseDetail);
  const documentIdToEdit = get(state.modal.documentIdToEdit);

  return { caseDetail, documentIdToEdit };
};
