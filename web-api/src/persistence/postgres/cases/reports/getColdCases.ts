import {
  CASE_STATUS_TYPES,
  COLD_CASE_LOOKBACK_IN_DAYS,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { ColdCaseEntry } from '@web-api/business/useCases/reports/coldCaseReportInteractor';
import {
  FORMATS,
  calculateDate,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';
import { sql } from 'kysely';

// Get all general-docket cases for which the most recent filing is before coldCaseLookBackDate and which has no pending documents.
export async function getColdCases() {
  const coldCaseLookBackDate = calculateDate({
    dateString: formatNow(),
    howMuch: -COLD_CASE_LOOKBACK_IN_DAYS,
    units: 'days',
  });

  const rawResults = await getDbReader(reader =>
    // First CTE: We will filter the cases to the correct status to avoid scanning all cases in the join
    reader
      .with('filteredCases', db =>
        db
          .selectFrom('dwCase')
          .select([
            'caseType',
            'createdAt',
            'docketNumber',
            'docketNumberSuffix',
            'leadDocketNumber',
            'preferredTrialCity',
          ])
          .where('status', '=', CASE_STATUS_TYPES.generalDocket),
      )
      // Second CTE: We will aggregate the docket entries, filtering out those with pending documents and whose most recent filing date is after coldCaseLookBackDate
      .with('aggregatedEntries', db =>
        db
          .selectFrom('dwDocketEntry as d')
          .innerJoin('filteredCases as fc', 'd.docketNumber', 'fc.docketNumber')
          .select([
            'd.docketNumber',
            ({ fn }) => fn.max('d.filingDate').as('mostRecentFilingDate'),
          ])
          .groupBy('d.docketNumber')
          .having(
            ({ fn }) => fn.max('d.filingDate'),
            '<=',
            coldCaseLookBackDate,
          )
          .having(
            ({ fn }) => fn.max(sql`CASE WHEN pending THEN 1 ELSE 0 END`),
            '=',
            0,
          ),
      )
      // Final query: join the CTEs with docketEntry and grab what we need
      .selectFrom('filteredCases as fc')
      .innerJoin(
        'aggregatedEntries as ae',
        'fc.docketNumber',
        'ae.docketNumber',
      )
      .innerJoin('dwDocketEntry as d', join =>
        join
          .onRef('d.docketNumber', '=', 'ae.docketNumber')
          .onRef('d.filingDate', '=', 'ae.mostRecentFilingDate'),
      )
      .selectAll()
      .select([
        'fc.caseType',
        'fc.createdAt',
        'fc.docketNumber',
        'fc.docketNumberSuffix',
        'fc.leadDocketNumber',
        'fc.preferredTrialCity',
        'ae.mostRecentFilingDate',
        'd.eventCode as mostRecentEventCode',
      ])
      .execute(),
  );

  const results = rawResults.map(result => {
    return {
      caseType: result.caseType,
      createdAt: formatDateString(
        result.createdAt.toISOString(),
        FORMATS.MMDDYYYY,
      ),
      docketNumber: result.docketNumber,
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: result.docketNumber,
        docketNumberSuffix: result.docketNumberSuffix,
      }),
      eventCode: result.mostRecentEventCode,
      filingDate: result.mostRecentFilingDate?.toISOString(),
      leadDocketNumber: result.leadDocketNumber,
      preferredTrialCity: result.preferredTrialCity,
    };
  });

  results.sort((a, b) => {
    const compareFilingDate = a.filingDate!.localeCompare(b.filingDate!);

    if (compareFilingDate === 0) {
      return Case.docketNumberSort(a.docketNumber, b.docketNumber);
    } else {
      return compareFilingDate;
    }
  });

  return results.map(result => ({
    ...result,
    filingDate: formatDateString(result.filingDate, FORMATS.MMDDYYYY),
  })) as ColdCaseEntry[];
}
