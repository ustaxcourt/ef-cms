import { fromCaseDeadlineKysely } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/database';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';

export const getCaseDeadlinesByConsolidatedCaseDeadlineId = async (
  consolidatedCaseDeadlineIds: string | string[],
  leadDocketNumber?: string,
): Promise<RawCaseDeadline[]> => {
  const RECORDS = await getDbReader(reader => {
    const query = reader
      .selectFrom('dwCaseDeadline as cd')
      .innerJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
      .selectAll('cd')
      .where(q => {
        const IDS = Array.isArray(consolidatedCaseDeadlineIds)
          ? consolidatedCaseDeadlineIds
          : [consolidatedCaseDeadlineIds];

        return q.or([
          q('cd.caseDeadlineId', 'in', IDS),
          q('cd.consolidatedCaseDeadlineId', '=', consolidatedCaseDeadlineIds),
        ]);
      });

    if (!leadDocketNumber) return query.execute();
    return query.where('c.leadDocketNumber', '=', leadDocketNumber).execute();
  });

  return RECORDS.map(r => fromCaseDeadlineKysely(r).toRawObject());
};
