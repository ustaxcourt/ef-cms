import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateCaseNote = async ({
  caseNote,
  docketNumber,
}: {
  caseNote: string;
  docketNumber: string;
}): Promise<void> => {
  await pgUpdateTable({
    table: 'dwCase',
    values: { caseNote },
    where: cb => cb.where('docketNumber', '=', docketNumber),
  });
};
