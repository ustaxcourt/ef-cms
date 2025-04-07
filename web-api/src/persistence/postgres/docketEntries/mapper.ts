import { calculateDate } from '@shared/business/utilities/DateHandler';

export const toKyselyNewDocketEntry = (docketEntry: RawDocketEntry) => {
  return {
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
  };
};
