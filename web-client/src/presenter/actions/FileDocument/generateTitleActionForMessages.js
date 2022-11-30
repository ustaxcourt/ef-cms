import { state } from 'cerebral';

const getDocumentTitleWithAdditionalInfo = documentMetaData => {
  const {
    additionalInfo: additionalInfoOfNewDoc,
    previousDocument: { additionalInfo, documentTitle },
  } = documentMetaData;
  const originalDocumentInfo = `${documentTitle} ${additionalInfo}`;
  return `${originalDocumentInfo} ${additionalInfoOfNewDoc}`;
};

/**
 * Gets document title based on documentTitle and additionalInfo fields
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} docketEntry the docketEntry
 * @returns {object} the document title
 */
export const generateTitleActionForMessages = ({ get, store }) => {
  const documentMetadata = get(state.form);
  const documentTitle = getDocumentTitleWithAdditionalInfo(documentMetadata);
  store.set(state.form.documentTitle, documentTitle);
};
