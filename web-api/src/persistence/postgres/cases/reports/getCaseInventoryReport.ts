import {
  CASE_INVENTORY_PAGE_SIZE,
  CASE_STATUS_TYPES,
} from '@shared/business/entities/EntityConstants';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { Case } from '@shared/business/entities/cases/Case';

export const getCaseInventoryReport = async ({
  associatedJudge,
  page = 0,
  pageSize = CASE_INVENTORY_PAGE_SIZE,
  status,
}: {
  associatedJudge?: string;
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<{
  foundCases: Omit<
    RawCase,
    'consolidatedCases' | 'correspondence' | 'docketEntries' | 'petitioners'
  >[];
  totalCount: number;
}> => {
  pageSize = Math.min(pageSize, CASE_INVENTORY_PAGE_SIZE);

  const { count, results } = await getDbReader(async reader => {
    let query = reader
      .selectFrom('dwCase')
      .where('status', 'not in', [
        CASE_STATUS_TYPES.closed,
        CASE_STATUS_TYPES.closedDismissed,
      ]);
    if (associatedJudge) {
      query = query.where('associatedJudge', 'like', `%${associatedJudge}`); // Judge X or X. Ideally, we would save in one form, but we don't.
    }
    if (status) {
      query = query.where('status', '=', status);
    }
    const totalCount = await query
      .select(({ fn }) => fn.count<string>('docketNumber').as('value')) // Casting to a number with <number> here does not actually cast it as a number
      .execute();

    query = query
      .orderBy('sortableDocketNumber', 'asc')
      .offset(page * pageSize)
      .limit(pageSize);
    const filteredResults = await query.selectAll().execute();
    return { count: totalCount[0].value, results: filteredResults };
  });

  return {
    foundCases: results.map(result => ({
      ...fromKyselyCase(result),
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: result.docketNumber,
        docketNumberSuffix: result.docketNumberSuffix,
      }),
    })),
    totalCount: Number(count),
  };
};
