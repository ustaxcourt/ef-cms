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
    isLegacyServed: docketEntry.isLegacyServed || false,
    pending: docketEntry.pending || false,
    receivedAt: calculateDate({ dateString: docketEntry.receivedAt }),
    servedAt: calculateDate({ dateString: docketEntry.servedAt }),
  }));

  console.log('docketEntries', docketEntries);

  await getDbWriter(writer =>
    writer
      .insertInto('dwDocketEntry')
      .values(docketEntriesToUpsert)
      .onConflict(oc =>
        oc.columns(['docketNumber', 'docketEntryId']).doUpdateSet(c => {
          return {
            filingDate: c.ref('excluded.filingDate'),
            pending: c.ref('excluded.pending'),
          };
        }),
      )
      .execute(),
  );
};
