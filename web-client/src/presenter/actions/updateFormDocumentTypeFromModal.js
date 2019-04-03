import { state } from 'cerebral';

/**
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral store used for getting state.caseDetail
 */
export const updateFormDocumentTypeFromModal = async ({ get, store }) => {
  const { modalDocumentType } = get(state.form);
  store.set(state.form.documentType, modalDocumentType);
  store.set(state.form.isDocumentTypeSelected, true);
};
