import { fromCaseDeadlineKysely } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';

export const getCaseDeadlinesByConsolidatedCaseDeadlineIds = async (
  consolidatedCaseDeadlineIds: string[],
): Promise<RawCaseDeadline[]> => {
  if (!consolidatedCaseDeadlineIds.length) return [];
  const RECORDS = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseDeadline as cd')
      .selectAll('cd')
      .where(q => {
        return q.or([
          q('cd.caseDeadlineId', 'in', consolidatedCaseDeadlineIds),
          q('cd.consolidatedCaseDeadlineId', 'in', consolidatedCaseDeadlineIds),
        ]);
      })
      .execute(),
  );

  return RECORDS.map(r => fromCaseDeadlineKysely(r).toRawObject());
};
