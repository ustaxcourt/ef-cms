export const getCaseDocumentsByFilter = (
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
  const documents = documentsToProcess.map(docSelected => {
    return docketEntries.find(
      docEntry => docEntry.docketEntryId === docSelected.docketEntryId,
    );
  });

  const filteredDocuments = applicationContext
    .getUtilities()
    .getDocketEntriesByFilter(applicationContext, {
      docketEntries: documents,
      docketRecordFilter,
    });

  const filteredDocumentsIds = filteredDocuments.map(doc => doc.docketEntryId);

  return filteredDocumentsIds;
};
