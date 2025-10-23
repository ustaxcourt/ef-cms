import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updateDocketEntryRelatedEntryServed = async ({
  orderDocketEntry,
  served = true,
}: {
  orderDocketEntry: RawDocketEntry;
  served: boolean;
}) => {
  await pgUpdateTable({
    table: 'dwDocketEntryRelatedDocketEntry',
    values: { served },
    where: db =>
      db.where('primaryDocketEntryId', '=', orderDocketEntry.docketEntryId),
  });
};
