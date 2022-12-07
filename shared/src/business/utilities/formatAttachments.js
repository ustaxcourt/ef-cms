/**
 * formats message attachments with meta data from aggregate case document arrays
 *
 * @params {object} params the params object
 * @param {array} attachments attachments to format
 * @param {object} caseDetail the case detail with documents, archivedDocketEntries (optional), and correspondence (optional)
 * @returns {array} the formatted array of attachment objects
 */
export const formatAttachments = ({
  applicationContext,
  attachments,
  caseDetail,
}) => {
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
