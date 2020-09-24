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

  const formattedDocketEntry = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, documentMetadata);

  let updatedDocumentTitle = applicationContext
    .getUseCases()
    .generateDocumentTitleInteractor({
      applicationContext,
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
