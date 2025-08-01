import { ClientApplicationContext } from '@web-client/applicationContext';
import { ExternalDocumentFactory } from '@shared/business/entities/externalDocument/ExternalDocumentFactory';
import { cloneDeep } from 'lodash';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';

/**
 * generateExternalDocumentTitle
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @returns {string|void} document title
 */
export const generateExternalDocumentTitle = (
  applicationContext: ClientApplicationContext,
  { documentMetadata },
) => {
  const entry = Object.values(SYSTEM_GENERATED_DOCUMENT_TYPES).find(
    entry => entry.eventCode === documentMetadata.eventCode,
  );
  if (entry) return entry.documentTitle;

  documentMetadata = cloneDeep(documentMetadata);

  if (documentMetadata.previousDocument) {
    documentMetadata.previousDocument.documentTitle = applicationContext
      .getUtilities()
      .getDocumentTitleWithAdditionalInfo({
        docketEntry: documentMetadata.previousDocument,
      });
  }

  const externalDocument = ExternalDocumentFactory(documentMetadata);
  const errors = externalDocument.getFormattedValidationErrors();
  if (!errors) {
    return externalDocument.getDocumentTitle();
  }
};
