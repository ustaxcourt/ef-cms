export const getDocumentStorageId = ({
  caseDetail,
  docketEntryId,
}: {
  caseDetail: RawCase;
  docketEntryId: string;
}): string => {
  const { docketEntries } = caseDetail;
  const docketEntry = docketEntries.find(de => {
    return de.docketEntryId === docketEntryId;
  });

  if (!docketEntry)
    throw new Error(`Could not find docketEntry for id: ${docketEntryId}`);

  return docketEntry.documentStorageId;
};
