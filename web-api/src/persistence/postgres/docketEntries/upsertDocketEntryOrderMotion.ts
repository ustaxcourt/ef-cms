import { NewDocketEntryOrderMotionKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertDocketEntryRelatedEntries = async ({
  orderDocketEntry,
  motionDocketEntries,
  served = false,
}: {
  orderDocketEntry: RawDocketEntry;
  motionDocketEntries: {
    docketNumber: string;
    docketEntryId: string;
    disposition: string;
  }[];
  served: boolean;
}) => {
  const values: NewDocketEntryOrderMotionKysely[] = motionDocketEntries.map(
    entry => ({
      docketNumber: entry.docketNumber,
      primaryDocketEntryId: orderDocketEntry.docketEntryId,
      secondaryDocketEntryId: entry.docketEntryId,
      disposition: entry.disposition,
      served,
    }),
  );

  await pgInsertInto({
    table: 'dwDocketEntryRelatedDocketEntry',
    values,
    onConflictColumns: [
      'primaryDocketEntryId',
      'docketNumber',
      'secondaryDocketEntryId',
    ],
  });
};
