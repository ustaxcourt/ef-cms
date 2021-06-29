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

  const { EXTERNAL_DOCUMENTS_ARRAY } = applicationContext.getConstants();

  const matchingDocument = EXTERNAL_DOCUMENTS_ARRAY.find(
    i => i.eventCode === documentMetadata.eventCode,
  );

  if (matchingDocument) {
    documentMetadata.documentTitle = matchingDocument.documentTitle;
  }

  const formattedDocketEntry = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, documentMetadata);

  let updatedDocumentTitle = applicationContext
    .getUseCases()
    .generateDocumentTitleInteractor(applicationContext, {
      documentMetadata,
    });

  if (formattedDocketEntry.additionalInfo) {
    updatedDocumentTitle += ` ${formattedDocketEntry.additionalInfo}`;
  }

  const filingsAndProceedings = applicationContext
    .getUtilities()
    .getFilingsAndProceedings(formattedDocketEntry);

  if (filingsAndProceedings) {
    updatedDocumentTitle += ` ${filingsAndProceedings}`;
  }

  if (formattedDocketEntry.additionalInfo2) {
    updatedDocumentTitle += ` ${formattedDocketEntry.additionalInfo2}`;
  }

  store.set(state.screenMetadata.documentTitlePreview, updatedDocumentTitle);
};
