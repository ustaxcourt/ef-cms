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
import { isEmpty } from 'lodash';
import { sql } from 'kysely';

export async function getColdCases() {
  const coldCaseLookBackDate = calculateDate({
    dateString: formatNow(),
    howMuch: -COLD_CASE_LOOKBACK_IN_DAYS,
    units: 'days',
  });

  // Get all of the docket numbers that fit the requirements
  const validDocketNumbers = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as d')
      .select('d.docketNumber')
      .groupBy('d.docketNumber')
      // We want cases such that the most recent docket entry is before our cold case constant and such that no docket entries are pending
      .having(eb => eb.fn.max('d.filingDate'), '<=', coldCaseLookBackDate)
      .having(
        eb => eb.fn.sum(sql`CASE WHEN d.pending THEN 1 ELSE 0 END`),
        '=',
        0,
      )
      .execute(),
  );

  if (isEmpty(validDocketNumbers)) {
    return [];
  }

  const rawResults = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      // Limit to not-at-issue (general docket) cases
      .where('c.status', '=', CASE_STATUS_TYPES.generalDocket)
      .where(
        'c.docketNumber',
        'in',
        validDocketNumbers.map(d => d.docketNumber),
      )
      .select([
        'c.caseType',
        'c.createdAt',
        'c.docketNumber',
        'c.docketNumberSuffix',
        'c.leadDocketNumber',
        'c.preferredTrialCity',
      ])
      // Sub-select #1: most recent filingDate
      .select(eb =>
        eb
          .selectFrom('dwDocketEntry as recent')
          .select('recent.filingDate')
          .whereRef('recent.docketNumber', '=', 'c.docketNumber')
          .orderBy('recent.filingDate', 'desc')
          .limit(1)
          .as('mostRecentFilingDate'),
      )
      // Sub-select #2: eventCode from that same row
      .select(eb =>
        eb
          .selectFrom('dwDocketEntry as recent')
          .select('recent.eventCode')
          .whereRef('recent.docketNumber', '=', 'c.docketNumber')
          .orderBy('recent.filingDate', 'desc')
          .limit(1)
          .as('mostRecentEventCode'),
      )
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
