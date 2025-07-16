import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateDocketEntryPendingServiceStatus = async ({
  docketEntryId,
  docketNumber,
  status,
}: {
  docketEntryId: string;
  docketNumber: string;
  status: boolean;
}) => {
  await pgUpdateTable({
    table: 'dwDocketEntry',
    values: { isPendingService: status },
    where: db =>
      db
        .where('docketEntryId', '=', docketEntryId)
        .where('docketNumber', '=', docketNumber),
  });
};
