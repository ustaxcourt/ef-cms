import { getDbReader } from '@web-api/database';
import { calculateDate } from '@shared/business/utilities/DateHandler';

export interface RecentFilingDbResult {
  docketEntryId: string;
  docketNumber: string;
  filingDate: Date;
  documentTitle: string;
  isFileAttached: boolean | null;
  eventCode: string;
  isStricken: boolean | null;
  isSealed: boolean | null;
  sealedTo: string | null;
  servedAt: Date | null;
  isDraft: boolean | null;
  caption: string;
  caseIsSealed: boolean | null;
}

export const getRecentFilingsByDocketNumbers = async ({
  docketNumbers,
  startDate,
  endDate,
}: {
  docketNumbers: string[];
  startDate: string;
  endDate: string;
}): Promise<RecentFilingDbResult[]> => {
  if (docketNumbers.length === 0) {
    return [];
  }

  const dbDocketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as d')
      .innerJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
      .select([
        'd.docketEntryId',
        'd.docketNumber',
        'd.filingDate',
        'd.documentTitle',
        'd.isFileAttached',
        'd.eventCode',
        'd.isStricken',
        'd.isSealed',
        'd.sealedTo',
        'd.servedAt',
        'd.isDraft',
        'c.caption',
        'c.isSealed as caseIsSealed',
      ])
      .where('d.docketNumber', 'in', docketNumbers)
      .where('d.filingDate', '>=', calculateDate({ dateString: startDate }))
      .where('d.filingDate', '<=', calculateDate({ dateString: endDate }))
      .where('d.isStricken', 'is not', true)
      .where('d.eventCode', '!=', 'NOT')
      .where('d.eventCode', '!=', 'STIN')
      .where('d.isDraft', 'is not', true)
      .orderBy('d.filingDate', 'desc')
      .limit(1000)
      .execute(),
  );

  return dbDocketEntries;
};
