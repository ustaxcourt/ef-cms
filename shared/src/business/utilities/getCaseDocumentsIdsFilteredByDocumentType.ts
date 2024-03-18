export const getCaseDocumentsIdsFilteredByDocumentType = (
  applicationContext,
  {
    docketEntries,
    docketRecordFilter,
    documentsToProcess,
  }: {
    docketEntries: RawDocketEntry[];
    docketRecordFilter: string;
    documentsToProcess: { docketEntryId: string }[];
  },
): string[] => {
  const formattedDocketEntries = documentsToProcess.map(docSelected => {
    return docketEntries.find(
      docEntry => docEntry.docketEntryId === docSelected.docketEntryId,
    );
  });

  const filteredDocuments = applicationContext
    .getUtilities()
    .getDocketEntriesByFilter(applicationContext, {
      docketEntries: formattedDocketEntries,
      docketRecordFilter,
    });

  const filteredDocumentsIds = filteredDocuments.map(doc => doc.docketEntryId);

  return filteredDocumentsIds;
};
