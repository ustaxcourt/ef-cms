export const getDocumentStorageId = ({ caseDetail, docketEntryId }) => {
  const { docketEntries } = caseDetail;
  const docketEntry = docketEntries.find(de => {
    return de.docketEntryId === docketEntryId;
  });

  return docketEntry.documentStorageId;
};
