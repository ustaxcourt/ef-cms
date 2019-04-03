import { state } from 'cerebral';

/**
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the path to navigate to in state.path
 */
export const openSelectDocumentTypeModalAction = async ({ get, store }) => {
  const { documentType } = get(state.form);
  store.set(state.form.modalDocumentType, documentType);
  store.set(state.showModal, 'SelectDocumentTypeModalDialog');
};
