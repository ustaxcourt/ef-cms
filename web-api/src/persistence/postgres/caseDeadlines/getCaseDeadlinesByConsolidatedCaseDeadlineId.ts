import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/database';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';

export const getCaseDeadlinesByConsolidatedCaseDeadlineId = async (
  consolidatedCaseDeadlineId: string,
  leadDocketNumber?: string, // Make leadDocketNumber optional
): Promise<RawCaseDeadline[]> => {
  const RECORDS = await getDbReader(reader => {
    const query = reader
      .selectFrom('dwCaseDeadline as cd')
      .innerJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
      .selectAll()
      .where('cd.consolidatedCaseDeadlineId', '=', consolidatedCaseDeadlineId);

    if (!leadDocketNumber) return query.execute();
    return query.where('c.leadDocketNumber', '=', leadDocketNumber).execute();
  });

  return RECORDS.map(r => caseDeadlineEntity(r).toRawObject());
};
