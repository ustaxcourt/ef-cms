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
  const formattedDocketEntries = documentsToProcess.map(docSelected => {
    const foundDocument = docketEntries.find(
      docEntry => docEntry.docketEntryId === docSelected.docketEntryId,
    );
    return {
      docketEntryId: foundDocument?.docketEntryId,
      eventCode: foundDocument?.eventCode,
      isDraft: foundDocument?.isDraft,
    };
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
