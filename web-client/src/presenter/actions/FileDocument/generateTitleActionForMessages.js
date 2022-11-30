import { state } from 'cerebral';

/**
 * Gets document title based on documentTitle and additionalInfo fields
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} docketEntry the docketEntry
 * @returns {object} the document title
 */
export const generateTitleActionForMessages = ({
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
