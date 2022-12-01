/**
 * returns a modified document title when adding new information to a previous document title
 * especially in the case of qc'ing a docket entry
 *
 * @param {string} documentMetaData name of the feature
 * @returns {string} document title after modification
 */

const getModifiedDocumentTitleWithAdditionalInfo = documentMetaData => {
  if (documentMetaData.previousDocument) {
    const {
      additionalInfo: additionalInfoOfNewDocket,
      previousDocument: { additionalInfo, documentTitle },
    } = documentMetaData;

    const originalDocumentInfo = `${documentTitle} ${additionalInfo}`;
    return `${originalDocumentInfo} ${additionalInfoOfNewDocket || ''}`.trim();
  } else if (documentMetaData.freeText) {
    const {
      additionalInfo,
      documentTitle: documentTitleOfCurrentDocketEntry,
      freeText,
    } = documentMetaData;

    const placeholder = '[anything]';

    const docTitle = documentTitleOfCurrentDocketEntry.includes(placeholder)
      ? documentTitleOfCurrentDocketEntry.replace(placeholder, freeText || '')
      : documentTitleOfCurrentDocketEntry;

    return `${docTitle} ${additionalInfo || ''}
    }`.trim();
  }
  return documentMetaData.documentTitle;
};

module.exports = {
  getModifiedDocumentTitleWithAdditionalInfo,
};
