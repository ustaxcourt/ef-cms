import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/database';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';

export const getCaseDeadlinesByConsolidatedCaseDeadlineIds = async (
  consolidatedCaseDeadlineIds: string[],
): Promise<RawCaseDeadline[]> => {
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

  return RECORDS.map(r => caseDeadlineEntity(r).toRawObject());
};
