import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { getDbReader } from '@web-api/database';
import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';

export const getConsolidatedCaseDeadlines = async (
  consolidatedCaseDeadlineId: string,
  leadDocketNumber: string,
): Promise<RawCaseDeadline[]> => {
  return await getDbReader(async reader => {
    const RECORDS = await reader
      .selectFrom('dwCaseDeadline as cd')
      .innerJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
      .where('cd.consolidatedCaseDeadlineId', '=', consolidatedCaseDeadlineId)
      .where('c.leadDocketNumber', '=', leadDocketNumber)
      .selectAll(['cd'])
      .execute();

    return RECORDS.map(r => caseDeadlineEntity(r).validate().toRawObject());
  });
};
