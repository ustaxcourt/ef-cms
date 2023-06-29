import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the props from state for removing signature from a document
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the props needed for removing signature
 */
export const setPropsForRemoveSignatureAction = ({ get }: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryIdToEdit = get(state.modal.docketEntryIdToEdit);

  return { caseDetail, docketEntryIdToEdit };
};
