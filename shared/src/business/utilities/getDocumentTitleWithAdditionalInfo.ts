/**
 * Gets document title with additionalInfo if addToCoversheet is true
 *
 * @param {object} applicationContext the applicationContext
 * @param {object} docketEntry the docketEntry
 * @returns {object} the document title
 */
export const getDocumentTitleWithAdditionalInfo = ({ docketEntry }) => {
  let { documentTitle } = docketEntry;

  if (docketEntry.addToCoversheet) {
    documentTitle = `${documentTitle} ${
      docketEntry.additionalInfo || ''
    }`.trim();
  }
  return documentTitle;
};
