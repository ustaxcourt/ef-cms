import { caseDeadlineEntity } from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { getDbReader } from '@web-api/database';
import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';

export const getCaseDeadlinesByConsolidatedCaseDeadlineId = async (
  consolidatedCaseDeadlineId: string,
): Promise<RawCaseDeadline[]> => {
  const RECORDS = await getDbReader(reader =>
    reader
      .selectFrom('dwCaseDeadline')
      .where('consolidatedCaseDeadlineId', '=', consolidatedCaseDeadlineId)
      .selectAll()
      .execute(),
  );

  return RECORDS.map(r => caseDeadlineEntity(r).toRawObject());
};
