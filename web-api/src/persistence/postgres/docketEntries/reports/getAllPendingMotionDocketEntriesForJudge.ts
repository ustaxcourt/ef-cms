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
import { sql, SqlBool } from 'kysely';

export const getAllPendingMotionDocketEntriesForJudge = async ({
  judgeIds,
}: {
  judgeIds: string[];
}): Promise<{ results: FormattedPendingMotion[]; total: number }> => {
  const results = await getDbReader(async reader => {
    const query = reader
      .selectFrom('dwDocketEntry as d')
      .innerJoin('dwCase as c', 'd.docketNumber', 'c.docketNumber')
      .where('d.pending', 'is', true)
      .where('c.associatedJudgeId', 'in', judgeIds)
      // sql.lit() is intentionally used here instead of parameterized values to
      // work around a Kysely parameter-numbering/binding bug that occurs when
      // many bound parameters are present (e.g., judgeIds plus MOTION_EVENT_CODES).
      // This is safe because MOTION_EVENT_CODES is a static compile-time constant
      // with no user input.
      .where(
        sql<SqlBool>`d."event_code" IN (${sql.join(
          MOTION_EVENT_CODES.map(code => sql.lit(code)),
          sql`, `,
        )})`,
      )
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
      ]);

    console.log(
      '[9733] getAllPendingMotionDocketEntriesForJudge query: ',
      query.compile(),
    );

    return query.execute();
  });

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
        judge: r.associatedJudge ?? undefined,
        pending: r.pending ?? false,
      };
    }),
  );

  return {
    results: mappedResults,
    total: results.length,
  };
};
