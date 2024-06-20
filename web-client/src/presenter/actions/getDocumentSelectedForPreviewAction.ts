import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentSelectedForPreviewAction = ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { documentId } = props;
  const { docketEntries } = get(state.form);

  if (documentId) {
    const selectedDocument = get(docketEntries).find(
      docketEntry => docketEntry.docketEntryId === documentId,
    );

    return {
      documentInS3: selectedDocument,
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

  const selectedDocument = get(docketEntries).find(
    document => document.documentType === documentTypeSelectedForPreview,
  );

  return {
    documentInS3: selectedDocument,
  };
};
