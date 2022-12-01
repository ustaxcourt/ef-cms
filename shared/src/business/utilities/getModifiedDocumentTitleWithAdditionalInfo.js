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
      additionalInfo: additionalInfoOfNewDoc,
      previousDocument: { additionalInfo, documentTitle },
    } = documentMetaData;
    const originalDocumentInfo = `${documentTitle} ${additionalInfo}`;
    return `${originalDocumentInfo} ${additionalInfoOfNewDoc || ''}`.trim();
  }
  return documentMetaData.documentTitle;
};

module.exports = {
  getModifiedDocumentTitleWithAdditionalInfo,
};
