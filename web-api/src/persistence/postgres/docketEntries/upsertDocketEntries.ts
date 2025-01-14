import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbWriter } from '@web-api/database';

export const upsertDocketEntries = async (docketEntries: RawDocketEntry[]) => {
  if (docketEntries.length === 0) return;

  const docketEntriesToUpsert = docketEntries.map(docketEntry => ({
    createdAt: calculateDate({ dateString: docketEntry.createdAt }),
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
    isSealed: docketEntry.isSealed === undefined ? false : docketEntry.isSealed,
    judge: docketEntry.judge || null,
    numberOfPages: docketEntry.numberOfPages,
    pending: docketEntry.pending === undefined ? false : docketEntry.pending,
    receivedAt: calculateDate({ dateString: docketEntry.receivedAt }),
    sealedTo: docketEntry.sealedTo,
    servedAt: docketEntry.servedAt
      ? calculateDate({ dateString: docketEntry.servedAt })
      : null,
    signedJudgeName: docketEntry.signedJudgeName || null,
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
            isSealed: c.ref('excluded.isSealed'),
            judge: c.ref('excluded.judge'),
            numberOfPages: c.ref('excluded.numberOfPages'),
            pending: c.ref('excluded.pending'),
            receivedAt: c.ref('excluded.receivedAt'),
            sealedTo: c.ref('excluded.sealedTo'),
            servedAt: c.ref('excluded.servedAt'),
            signedJudgeName: c.ref('excluded.signedJudgeName'),
          };
        }),
      )
      .execute(),
  );
};
