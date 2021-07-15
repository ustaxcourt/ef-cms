import { state } from 'cerebral';

/**
 * Returns the in-memory file if there is one, otherwise returns the document from case detail.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get method
 * @returns {object} the file from browser memory or document from the case detail
 */
export const getDocumentSelectedForPreviewAction = ({
  applicationContext,
  get,
}) => {
  const { INITIAL_DOCUMENT_TYPES_MAP } = applicationContext.getConstants();
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );
  const file = get(state.form[documentSelectedForPreview]);

  if (file) {
    return { fileFromBrowserMemory: file };
  }

  const documentTypeSelectedForPreview =
    INITIAL_DOCUMENT_TYPES_MAP[documentSelectedForPreview];
  const { docketEntries } = get(state.form);
  const selectedDocument = get(docketEntries).find(
    document => document.documentType === documentTypeSelectedForPreview,
  );

  return { documentInS3: selectedDocument };
};
