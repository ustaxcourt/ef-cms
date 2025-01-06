import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

export const upsertDocketEntries = async (docketEntries: RawDocketEntry[]) => {
  if (docketEntries.length === 0) return;

  const docketEntriesToUpsert = docketEntries.map(docketEntry => ({
    docketEntryId: docketEntry.docketEntryId,
    docketNumber: docketEntry.docketNumber,
    documentTitle: docketEntry.documentTitle,
    documentType: docketEntry.documentType,
    eventCode: docketEntry.eventCode,
    filingDate: calculateDate({ dateString: docketEntry.filingDate }),
    isLegacyServed:
      docketEntry.isLegacyServed === undefined
        ? false
        : docketEntry.isLegacyServed,
    pending: docketEntry.pending === undefined ? false : docketEntry.pending,
    receivedAt: calculateDate({ dateString: docketEntry.receivedAt }),
    servedAt: docketEntry.servedAt
      ? calculateDate({ dateString: docketEntry.servedAt })
      : null,
  }));

  await getDbWriter(writer =>
    writer
      .insertInto('dwDocketEntry')
      .values(docketEntriesToUpsert)
      .onConflict(oc =>
        oc.columns(['docketNumber', 'docketEntryId']).doUpdateSet(c => {
          return {
            documentTitle: c.ref('excluded.documentTitle'),
            documentType: c.ref('excluded.documentType'),
            eventCode: c.ref('excluded.eventCode'),
            filingDate: c.ref('excluded.filingDate'),
            isLegacyServed: c.ref('excluded.isLegacyServed'),
            pending: c.ref('excluded.pending'),
            receivedAt: c.ref('excluded.receivedAt'),
            servedAt: c.ref('excluded.servedAt'),
          };
        }),
      )
      .execute(),
  );
};
