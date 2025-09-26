import { NewDocketEntryOrderMotionKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertDocketEntryOrderMotions = async ({
  orderDocketEntry,
  motionDocketEntries,
  served = false,
}: {
  orderDocketEntry: RawDocketEntry;
  motionDocketEntries: {
    docketEntryId: string;
    docketNumber: string;
    dispostion: string;
  }[];
  served: boolean;
}) => {
  const values: NewDocketEntryOrderMotionKysely[] = motionDocketEntries.map(
    entry => ({
      orderDocketEntryId: orderDocketEntry.docketEntryId,
      orderDocketNumber: orderDocketEntry.docketNumber,
      motionDocketEntryId: entry.docketEntryId,
      motionDocketNumber: entry.docketNumber,
      disposition: entry.dispostion,
      served,
    }),
  );

  await pgInsertInto({
    table: 'dwDocketEntryOrderMotion',
    values,
    onConflictColumns: [
      'orderDocketEntryId',
      'motionDocketEntryId',
      'motionDocketNumber',
    ],
  });
};
