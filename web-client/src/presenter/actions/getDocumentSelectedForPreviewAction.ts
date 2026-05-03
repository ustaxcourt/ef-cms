import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentSelectedForPreviewAction = ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { documentId } = props;
  const { docketEntries = [] } = get(state.form);

  if (documentId) {
    const selectedDocument = docketEntries.find(
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

  if (!documentSelectedForPreview) {
    return {};
  }

  const documentFromDocketEntryId = docketEntries.find(
    docketEntry => docketEntry.docketEntryId === documentSelectedForPreview,
  );

  if (documentFromDocketEntryId) {
    return {
      documentInS3: documentFromDocketEntryId,
    };
  }

  const file = get(state.form[documentSelectedForPreview]);

  if (file) {
    return { fileFromBrowserMemory: file };
  }

  const documentTypeSelectedForPreview =
    INITIAL_DOCUMENT_TYPES_MAP[documentSelectedForPreview];

  const selectedDocument = docketEntries.find(
    document => document.documentType === documentTypeSelectedForPreview,
  );

  return {
    documentInS3: selectedDocument,
  };
};
