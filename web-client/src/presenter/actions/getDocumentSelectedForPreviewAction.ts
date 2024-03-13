import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentSelectedForPreviewAction = ({
  applicationContext,
  get,
}: ActionProps) => {
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

  return {
    documentInS3: selectedDocument,
  };
};
