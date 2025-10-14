import { NewDocketEntryOrderMotionKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertDocketEntryRelatedEntries = async ({
  orderDocketEntry,
  motionDocketEntries,
  served = false,
}: {
  orderDocketEntry: RawDocketEntry;
  motionDocketEntries: {
    docketEntryId: string;
    docketNumber: string;
    disposition: string;
  }[];
  served: boolean;
}) => {
  const values: NewDocketEntryOrderMotionKysely[] = motionDocketEntries.map(
    entry => ({
      primaryDocketEntryId: orderDocketEntry.docketEntryId,
      primaryDocketNumber: entry.docketNumber,
      secondaryDocketEntryId: entry.docketEntryId,
      secondaryDocketNumber: entry.docketNumber,
      disposition: entry.disposition,
      served,
    }),
  );

  await pgInsertInto({
    table: 'dwDocketEntryRelatedDocketEntry',
    values,
    onConflictColumns: [
      'primaryDocketEntryId',
      'primaryDocketNumber',
      'secondaryDocketEntryId',
      'secondaryDocketNumber',
    ],
  });
};
