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
  
  const systemGeneratedEventCodes = Object.keys(
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(key => {
    return SYSTEM_GENERATED_DOCUMENT_TYPES[key].eventCode;
  });

  const getTitleForSystemGeneratedDocument = (eventCode: string) => {
    for (const entry of Object.values(SYSTEM_GENERATED_DOCUMENT_TYPES)) {
      if (entry.eventCode === eventCode) {
        return entry.documentTitle;
      }
    }
  };

  if (systemGeneratedEventCodes.includes(documentMetadata.eventCode)) {
    return getTitleForSystemGeneratedDocument(documentMetadata.eventCode);
  }

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
