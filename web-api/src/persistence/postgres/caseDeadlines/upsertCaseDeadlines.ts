import { RawCaseDeadline } from '@shared/business/entities/CaseDeadline';
import {
  caseDeadlineEntity,
  toKyselyNewCaseDeadline,
} from '@web-api/persistence/postgres/caseDeadlines/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertCaseDeadlines = async (
  caseDeadlinesToUpsert: RawCaseDeadline[],
) => {
  if (!caseDeadlinesToUpsert.length) {
    return [];
  }

  const caseDeadlines = await pgInsertInto({
    table: 'dwCaseDeadline',
    values: caseDeadlinesToUpsert.map(cd => toKyselyNewCaseDeadline(cd)),
    onConflictColumns: ['caseDeadlineId'],
  });

  return caseDeadlines.map(cd => caseDeadlineEntity(cd));
};
