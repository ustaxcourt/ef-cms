import { ClientApplicationContext } from '../../../../web-client/src/applicationContext';

export const getCaseDocumentsIdsFilteredByDocumentType = (
  applicationContext: ClientApplicationContext,
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
  const docketEntriesToDownload: RawDocketEntry[] = [];
  
  docIdsSelectedForDownload.forEach(docSelected => {  
    const entry = docketEntries.find(
      docEntry => docEntry.docketEntryId === docSelected.docketEntryId,
    );
    if (entry) {
      docketEntriesToDownload.push(entry);
    }
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