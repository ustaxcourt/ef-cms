import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * generate document titles for supporting documents when filing external document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const generateTitleForSupportingDocumentsAction = ({
  applicationContext,
  get,
  store,
}) => {
  const documentMetadata = get(state.form);
  let documentTitle;

  const { supportingDocuments } = documentMetadata;
  if (supportingDocuments) {
    for (let i = 0; i < supportingDocuments.length; i++) {
      if (!isEmpty(supportingDocuments[i])) {
        documentTitle = applicationContext
          .getUseCases()
          .generateDocumentTitleInteractor(applicationContext, {
            documentMetadata: supportingDocuments[i],
          });
        store.set(
          state.form.supportingDocuments[i].documentTitle,
          documentTitle,
        );
      }
    }
  }

  const { secondarySupportingDocuments } = documentMetadata;
  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      if (!isEmpty(secondarySupportingDocuments[i])) {
        documentTitle = applicationContext
          .getUseCases()
          .generateDocumentTitleInteractor(applicationContext, {
            documentMetadata: secondarySupportingDocuments[i],
          });
        store.set(
          state.form.secondarySupportingDocuments[i].documentTitle,
          documentTitle,
        );
      }
    }
  }
};
