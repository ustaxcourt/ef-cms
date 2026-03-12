import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateCaseNote = async ({
  caseNote,
  docketNumber,
}: {
  caseNote: string | null;
  docketNumber: string;
}): Promise<void> => {
  await pgUpdateTable({
    table: 'dwCase',
    values: { caseNote },
    where: qb => qb.where('docketNumber', '=', docketNumber),
  });
};
