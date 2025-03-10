import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { getDbReader } from '@web-api/database';
import { CaseDeadlineTable } from '@web-api/database-types';

export const getConsolidatedCaseDeadlines = async (
  consolidatedCaseDeadlineId: string,
  leadDocketNumber: string,
): Promise<RawCaseDeadline[]> => {
  return await getDbReader(async reader => {
    const RECORDS: CaseDeadlineTable[] = await reader
      .selectFrom('dwCaseDeadline as cd')
      .innerJoin('dwCase as c', 'c.docketNumber', 'cd.docketNumber')
      .selectAll()
      .where('cd.consolidatedCaseDeadlineId', '=', consolidatedCaseDeadlineId)
      .where('c.leadDocketNumber', '=', leadDocketNumber)
      .execute();

    return RECORDS.map(r => new CaseDeadline(r).toRawObject());
  });
};
