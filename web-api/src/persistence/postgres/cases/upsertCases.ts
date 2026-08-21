import { toKyselyNewCase } from '@web-api/persistence/postgres/cases/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertCases = async (rawCases: RawCase[]) => {
  if (rawCases.length === 0) return;

  await pgInsertInto({
    table: 'dwCase',
    values: rawCases.map(rawCase => toKyselyNewCase(rawCase)),
    onConflictColumns: ['docketNumber'],
  });
};
