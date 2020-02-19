import { state } from 'cerebral';

/**
 * sets document title
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setCaseConfirmationFormDocumentTitleAction = ({ get, store }) => {
  const { docketNumber } = get(state.caseDetail);

  store.set(state.form.documentTitle, `Case Confirmation for ${docketNumber}`);
};
