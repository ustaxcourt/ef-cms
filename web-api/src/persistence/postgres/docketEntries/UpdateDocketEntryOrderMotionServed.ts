import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateDocketEntryOrderMotionServed = async ({
  orderDocketEntry,
  served = true,
}: {
  orderDocketEntry: RawDocketEntry;
  served: boolean;
}) => {
  await pgUpdateTable({
    table: 'dwDocketEntryOrderMotion',
    values: { served },
    where: db =>
      db.where('orderDocketEntryId', '=', orderDocketEntry.docketEntryId),
  });
};
