/**
 * generateCourtIssuedDocumentTitleInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @returns {string} document title
 */
exports.generateCourtIssuedDocumentTitleInteractor = ({
  applicationContext,
  documentMetadata,
}) => {
  const courtIssuedDocument = applicationContext
    .getEntityConstructors()
    .CourtIssuedDocumentFactory.get(documentMetadata);
  if (courtIssuedDocument) {
    return courtIssuedDocument.getDocumentTitle();
  }
};
