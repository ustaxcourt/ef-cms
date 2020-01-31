import { state } from 'cerebral';

/**
 * generate document titles for filing document
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const generateTitlePreviewAction = ({
  applicationContext,
  get,
  store,
}) => {
  const documentMetadata = get(state.form);

  const formattedDocument = applicationContext
    .getUtilities()
    .formatDocument(applicationContext, documentMetadata);

  let updatedDocumentTitle = applicationContext
    .getUseCases()
    .generateDocumentTitleInteractor({
      applicationContext,
      documentMetadata,
    });

  if (formattedDocument.additionalInfo) {
    updatedDocumentTitle += ` ${formattedDocument.additionalInfo}`;
  }

  const filingsAndProceedings = applicationContext
    .getUtilities()
    .getFilingsAndProceedings(formattedDocument);

  if (filingsAndProceedings) {
    updatedDocumentTitle += ` ${filingsAndProceedings}`;
  }

  if (formattedDocument.additionalInfo2) {
    updatedDocumentTitle += ` ${formattedDocument.additionalInfo2}`;
  }

  store.set(state.screenMetadata.documentTitlePreview, updatedDocumentTitle);
};
