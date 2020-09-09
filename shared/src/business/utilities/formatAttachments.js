/**
 * formats message attachments with meta data from aggregate case document arrays
 *
 * @params {object} params the params object
 * @param {array} attachments attachments to format
 * @param {object} caseDetail the case detail with documents, archivedDocketEntries (optional), and correspondence (optional)
 * @returns {array} the formatted array of attachment objects
 */
export const formatAttachments = ({ attachments, caseDetail }) => {
  const {
    archivedDocketEntries = [],
    archivedCorrespondences = [],
    correspondence = [],
    docketEntries,
  } = caseDetail;

  const allDocuments = [
    ...archivedDocketEntries,
    ...archivedCorrespondences,
    ...docketEntries,
    ...correspondence,
  ];

  const formattedAttachments = attachments.map(({ documentId }) => {
    const document = allDocuments.find(d => d.documentId === documentId);

    if (document) {
      return {
        archived: !!document.archived,
        documentId,
        documentTitle: document.documentTitle || document.documentType,
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
