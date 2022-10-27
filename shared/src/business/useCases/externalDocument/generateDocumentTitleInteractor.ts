import { ExternalDocumentFactory } from '../../entities/externalDocument/ExternalDocumentFactory';

/**
 * generateDocumentTitleInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @returns {string} document title
 */
export const generateDocumentTitleInteractor = (
  applicationContext: IApplicationContext,
  { documentMetadata },
) => {
  console.log('generateDocumentTitleInteractor is CALLED *****');
  console.log('documentMetadata ********', documentMetadata);

  // console.log('documentMetadata', documentMetadata);
  //    POSSIBLE SOLUTION:
  //    1. get the entire docket entry for the previous document
  //    then pass that as docketEntry

  if (documentMetadata.previousDocument) {
    documentMetadata.previousDocument.documentTitle = applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo({
        docketEntry: documentMetadata.previousDocument,
      });
  }

  const externalDocument = ExternalDocumentFactory(documentMetadata);

  return externalDocument.getDocumentTitle();
};
