import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const deleteCaseNote = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<void> => {
  await pgUpdateTable({
    table: 'dwCase',
    values: { caseNote: null },
    where: cb => cb.where('docketNumber', '=', docketNumber),
  });
};
