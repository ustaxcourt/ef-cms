export type FormattedAttachment = {
  archived: boolean;
  documentId: string | null;
  documentTitle: string;
  index?: number;
};

export const formatAttachments = ({
  applicationContext,
  attachments,
  caseDetail,
}): FormattedAttachment[] => {
  const formattedAttachments = attachments.map(({ documentId }) => {
    const doc = applicationContext.getUtilities().getAttachmentDocumentById({
      caseDetail,
      documentId,
      useArchived: true,
    });

    if (doc) {
      const generatedDocumentTitle = applicationContext
        .getUtilities()
        .getDocumentTitleWithAdditionalInfo({ docketEntry: doc });

      return {
        archived: !!doc.archived,
        documentId,
        documentTitle: generatedDocumentTitle || doc.documentType,
        index: doc.index,
      };
    } else {
      return {
        archived: true,
        documentId: null,
        documentTitle: '[ Document Unavailable ]',
      };
    }
  });

  return formattedAttachments;
};
