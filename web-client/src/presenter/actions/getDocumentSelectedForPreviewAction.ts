import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentSelectedForPreviewAction = ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  documentId?: string;
}>) => {
  const { documentId } = props;

  if (documentId) {
    return {
      documentInS3: {
        docketEntryId: documentId,
      },
    };
  }

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
