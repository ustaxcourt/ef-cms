import { state } from 'cerebral';

/**
 * sets the document to be edited from the current caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {void} sets the documentToEdit on state
 */
export const setPropsForRemoveSignatureAction = ({ get }) => {
  const caseDetail = get(state.caseDetail);
  const documentIdToEdit = get(state.modal.documentIdToEdit);

  return { caseDetail, documentIdToEdit };
};
