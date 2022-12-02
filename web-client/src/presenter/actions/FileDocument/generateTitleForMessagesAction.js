import { state } from 'cerebral';

/**
 * Gets document title based on documentTitle, additionalInfo, and/or freeText fields
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} providers.get the cerebral store used for getting state.form
 * @param {object} providers.store the cerebral store used for setting state.form.documentTitle
 */
export const generateTitleForMessagesAction = ({
  applicationContext,
  get,
  store,
}) => {
  const documentMetadata = get(state.form);
  const documentTitle = applicationContext
    .getUtilities()
    .getModifiedDocumentTitleWithAdditionalInfo(documentMetadata);

  store.set(state.form.documentTitle, documentTitle);
};
