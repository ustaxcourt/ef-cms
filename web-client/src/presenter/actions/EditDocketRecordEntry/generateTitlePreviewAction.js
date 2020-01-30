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

  let documentTitle = applicationContext
    .getUseCases()
    .generateDocumentTitleInteractor({
      applicationContext,
      documentMetadata,
    });

  documentTitle = documentTitle
    ? `${documentTitle}${
        documentMetadata.attachments ? ' (Attachment(s))' : ''
      }`
    : '';

  store.set(state.screenMetadata.documentTitlePreview, documentTitle);
};
