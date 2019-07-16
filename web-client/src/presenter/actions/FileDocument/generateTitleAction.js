import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const generateTitleAction = ({ applicationContext, get, store }) => {
  const documentMetadata = get(state.form);

  let documentTitle = applicationContext
    .getUseCases()
    .generateDocumentTitleInteractor({
      applicationContext,
      documentMetadata,
    });
  store.set(state.form.documentTitle, documentTitle);

  if (!isEmpty(documentMetadata.secondaryDocument)) {
    documentTitle = applicationContext
      .getUseCases()
      .generateDocumentTitleInteractor({
        applicationContext,
        documentMetadata: documentMetadata.secondaryDocument,
      });
    store.set(state.form.secondaryDocument.documentTitle, documentTitle);
  }

  const supportingDocuments = documentMetadata.supportingDocuments;
  if (supportingDocuments) {
    for (let i=0; i<supportingDocuments.length; i++) {
      if (!isEmpty(supportingDocuments[i].supportingDocumentMetadata)) {
        documentTitle = applicationContext
          .getUseCases()
          .generateDocumentTitleInteractor({
            applicationContext,
            documentMetadata: supportingDocuments[i].supportingDocumentMetadata,
          });
        store.set(
          state.form.supportingDocuments[i].supportingDocumentMetadata.documentTitle,
          documentTitle,
        );
      }  
    }
  }

  const secondarySupportingDocuments = documentMetadata.secondarySupportingDocuments;
  if (secondarySupportingDocuments) {
    for (let i=0; i<secondarySupportingDocuments.length; i++) {
      if (!isEmpty(secondarySupportingDocuments[i].secondarySupportingDocumentMetadata)) {
        documentTitle = applicationContext
          .getUseCases()
          .generateDocumentTitleInteractor({
            applicationContext,
            documentMetadata: secondarySupportingDocuments[i].secondarySupportingDocumentMetadata,
          });
        store.set(
          state.form.secondarySupportingDocuments[i].secondarySupportingDocumentMetadata.documentTitle,
          documentTitle,
        );
      }  
    }
  }
};
