import { FormattedPendingMotion } from '@web-api/business/useCases/pendingMotion/getPendingMotionDocketEntriesForCurrentJudgeInteractor';
import { MOTION_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import {
  calculateDate,
  calculateDifferenceInDays,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getConsolidatedCasesCount } from '@web-api/persistence/postgres/cases/getConsolidatedCasesCount';
import { getDbReader } from '@web-api/database';

export const getAllPendingMotionDocketEntriesForJudge = async ({
  judgeIds,
}: {
  judgeIds: string[];
}): Promise<{ results: FormattedPendingMotion[]; total: number }> => {
  const results = await getDbReader(async reader =>
    reader
      .selectFrom('dwDocketEntry as d')
      .innerJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
      .where('d.pending', 'is', true)
      .where('c.associatedJudgeId', 'in', judgeIds)
      .where('d.eventCode', 'in', MOTION_EVENT_CODES)
      .where(
        'd.filingDate',
        '<=',
        calculateDate({ howMuch: -180, units: 'days' }),
      )

      .select([
        'c.associatedJudge',
        'c.associatedJudgeId',
        'c.caption',
        'c.docketNumber',
        'c.docketNumberSuffix',
        'c.status',
        'c.leadDocketNumber',
        'c.trialDate',
        'c.trialLocation',
        'd.docketEntryId',
        'd.eventCode',
        'd.filingDate',
        'd.pending',
      ])
      .execute(),
  );

  const mappedResults = await Promise.all(
    results.map(async r => {
      const consolidatedGroupCount = r.leadDocketNumber
        ? await getConsolidatedCasesCount({
            leadDocketNumber: r.leadDocketNumber,
          })
        : 1;

      return {
        ...fromKyselyCase(r),
        consolidatedGroupCount,
        daysSinceCreated: calculateDifferenceInDays(
          formatNow(),
          r.filingDate.toISOString(),
        ),
        filingDate: r.filingDate.toISOString(),
        pending: r.pending ?? false,
      };
    }),
  );

  return {
    results: mappedResults,
    total: results.length,
  };
};
