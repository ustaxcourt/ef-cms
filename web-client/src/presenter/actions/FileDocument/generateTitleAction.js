import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * generate document titles for filing documents
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const generateTitleAction = ({ applicationContext, get, store }) => {
  const documentMetadata = get(state.form);

  let documentTitle = applicationContext
    .getUseCases()
    .generateDocumentTitleInteractor(applicationContext, {
      documentMetadata,
    });
  store.set(state.form.documentTitle, documentTitle);

  if (!isEmpty(documentMetadata.secondaryDocument)) {
    documentTitle = applicationContext
      .getUseCases()
      .generateDocumentTitleInteractor(applicationContext, {
        documentMetadata: documentMetadata.secondaryDocument,
      });
    store.set(state.form.secondaryDocument.documentTitle, documentTitle);
  }
};
