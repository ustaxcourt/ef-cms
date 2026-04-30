import { getDbReader } from '@web-api/persistence/postgres/database';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { fromKyselyDocketEntry } from './mapper';

const MAX_RECENT_FILINGS = 1000;

export interface RecentFilingDbResult {
  docketEntryId: string;
  docketNumber: string;
  filingDate: string;
  documentTitle: string;
  isFileAttached: boolean | undefined;
  eventCode: string;
  isStricken: boolean | undefined;
  isSealed: boolean | undefined;
  sealedTo: string | undefined;
  servedAt: string | undefined;
  isDraft: boolean | undefined;
  caption: string;
  caseIsSealed: boolean | undefined;
}

export interface RecentFilingWithCaseDetails {
  docketEntryId: string;
  docketNumber: string;
  filingDate: string;
  documentTitle: string;
  isFileAttached: boolean | undefined;
  eventCode: string;
  isStricken: boolean | undefined;
  isSealed: boolean | undefined;
  sealedTo: string | undefined;
  servedAt?: string;
  isDraft: boolean | undefined;
  caseCaption: string;
  caseIsSealed: boolean | undefined;
  caseDetails?: Omit<
    RawCase,
    'consolidatedCases' | 'docketEntries' | 'hearings' | 'correspondence'
  >; // Case entity for user association checking
}

export const getRecentFilingsByDocketNumbers = async ({
  docketNumbers,
  startDate,
  endDate,
  includeCaseDetails = false,
}: {
  docketNumbers: string[];
  startDate: string;
  endDate: string;
  includeCaseDetails?: boolean;
}): Promise<RecentFilingDbResult[] | RecentFilingWithCaseDetails[]> => {
  if (docketNumbers.length === 0) {
    return [];
  }

  // Get recent filings from docket entries
  const rawDbDocketEntries = await getDbReader(reader =>
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
      .where('d.eventCode', '!=', 'STIN')
      .where('d.isDraft', 'is not', true)
      .orderBy('d.filingDate', 'desc')
      .limit(MAX_RECENT_FILINGS)
      .execute(),
  );
  const dbDocketEntries = rawDbDocketEntries.map(d => fromKyselyDocketEntry(d));

  // If case details are not needed, return raw data
  if (!includeCaseDetails) {
    return dbDocketEntries;
  }

  // Get unique docket numbers from the results
  const uniqueDocketNumbers = [
    ...new Set(dbDocketEntries.map(d => d.docketNumber)),
  ];

  // Get case details for user association checking
  const caseDetails = await getCasesByDocketNumbers({
    docketNumbers: uniqueDocketNumbers,
    excludeFields: ['docketEntries', 'hearings', 'correspondence'],
  });

  // Create a map for quick case lookup
  const caseDetailsMap = new Map();
  caseDetails.forEach(caseDetail => {
    caseDetailsMap.set(caseDetail.docketNumber, caseDetail);
  });

  // Combine the data with case details
  return dbDocketEntries.map(d => ({
    ...d,
    caseDetails: caseDetailsMap.get(d.docketNumber),
  }));
};
