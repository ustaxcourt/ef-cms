import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const setPriorityOnAllWorkItems = async ({
  docketNumbers,
  highPriority,
}: {
  docketNumbers: string[];
  highPriority: boolean;
}) => {
  await pgUpdateTable({
    table: 'dwWorkItem',
    values: { highPriority },
    where: cb => cb.where('docketNumber', 'in', docketNumbers),
  });
};
