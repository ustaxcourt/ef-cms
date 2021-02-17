const {
  ExternalDocumentFactory,
} = require('../../entities/externalDocument/ExternalDocumentFactory');

/**
 * generateDocumentTitleInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @returns {string} document title
 */
exports.generateDocumentTitleInteractor = ({
  applicationContext,
  documentMetadata,
}) => {
  console.log('documentMetadata', documentMetadata);
  if (documentMetadata.previousDocument) {
    documentMetadata.documentTitle = applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo({ docketEntry: documentMetadata });
  }

  const externalDocument = ExternalDocumentFactory.get(documentMetadata, {
    applicationContext,
  });

  console.log(
    'externalDocument.getDocumentTitle',
    externalDocument.getDocumentTitle(),
  );

  return externalDocument.getDocumentTitle();
};
