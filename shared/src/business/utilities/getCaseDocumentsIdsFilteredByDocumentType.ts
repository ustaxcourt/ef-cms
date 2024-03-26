export const getCaseDocumentsIdsFilteredByDocumentType = (
  applicationContext,
  {
    docIdsSelectedForDownload,
    docketEntries,
    docketRecordFilter,
  }: {
    docketEntries: RawDocketEntry[];
    docketRecordFilter: string;
    docIdsSelectedForDownload: { docketEntryId: string }[];
  },
): string[] => {
  const docketEntriesToDownload = docIdsSelectedForDownload.map(docSelected => {
    return docketEntries.find(
      docEntry => docEntry.docketEntryId === docSelected.docketEntryId,
    );
  });

  const filteredDocuments = applicationContext
    .getUtilities()
    .getDocketEntriesByFilter(applicationContext, {
      docketEntries: docketEntriesToDownload,
      docketRecordFilter,
    });

  const filteredDocumentsIds = filteredDocuments.map(doc => doc.docketEntryId);

  return filteredDocumentsIds;
};
