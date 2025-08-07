import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { getDbReader } from '@web-api/persistence/postgres/database';

export const getCaseDeadlinesByConsolidatedCaseDeadlineId = async (
  consolidatedCaseDeadlineId: string,
  leadDocketNumber?: string,
): Promise<RawCaseDeadline[]> => {
  const RECORDS = await getDbReader(reader => {
    const query = reader
      .selectFrom('dwCaseDeadline as cd')
      .innerJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
      .selectAll('cd')
      .where(q =>
        q.or([
          q('cd.caseDeadlineId', '=', consolidatedCaseDeadlineId),
          q('cd.consolidatedCaseDeadlineId', '=', consolidatedCaseDeadlineId),
        ]),
      );

    if (!leadDocketNumber) return query.execute();
    return query.where('c.leadDocketNumber', '=', leadDocketNumber).execute();
  });

  return RECORDS.map(r => caseDeadlineEntity(r).toRawObject());
};
