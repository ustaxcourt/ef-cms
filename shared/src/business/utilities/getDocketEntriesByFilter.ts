import { getDocketEntriesByFilter } from '@web-client/presenter/computeds/formattedDocketEntries';

export const getCaseDocketEntriesByFilter = (
  applicationContext,
  {
    docketEntries,
    docketRecordFilter,
    documentIdsToProcess,
  }: {
    docketEntries: RawDocketEntry[];
    docketRecordFilter: string;
    documentIdsToProcess: { docketEntryId: string }[];
  },
): string[] => {
  const documentsToProcess = documentIdsToProcess.map(docSelected => {
    const docketEntryIdKey = Object.keys(docSelected)[0];
    return docketEntries.find(
      docEntry => docEntry[docketEntryIdKey] === docSelected[docketEntryIdKey],
    );
  });

  const filteredDocuments = getDocketEntriesByFilter(applicationContext, {
    docketEntries: documentsToProcess,
    docketRecordFilter,
  });

  const filteredDocumentsIds = filteredDocuments.map(doc => doc.docketEntryId);

  return filteredDocumentsIds;
};
