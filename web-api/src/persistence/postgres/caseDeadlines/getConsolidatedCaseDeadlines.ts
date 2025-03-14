import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import { getDbReader } from '@web-api/database';
import { CaseDeadlineTable } from '@web-api/database-types';
import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';

export const getConsolidatedCaseDeadlines = async (
  consolidatedCaseDeadlineId: string,
  leadDocketNumber: string,
): Promise<RawCaseDeadline[]> => {
  return await getDbReader(async reader => {
    const RECORDS: CaseDeadlineTable[] = await reader
      .selectFrom('dwCaseDeadline as cd')
      .innerJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
      .where('cd.consolidatedCaseDeadlineId', '=', consolidatedCaseDeadlineId)
      .where('c.leadDocketNumber', '=', leadDocketNumber)
      .selectAll(['cd'])
      .execute();

    //TODO: UPDATE TYPES TO HANDLE NULL VALUES INSTEAD OF CALLING NEW DB ENTITY
    return RECORDS.map(r => caseDeadlineEntity(r).validate().toRawObject());
  });
};
