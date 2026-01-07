import { getDbReader } from '@web-api/database';
import { DocketEntryOrderMotionKysely } from '@web-api/persistence/postgres/docketEntries/schema';

export const getDocketEntryOrderMotion = async (
  orderDocketEntityId: string,
): Promise<DocketEntryOrderMotionKysely[]> => {
  return getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntryRelatedDocketEntry')
      .selectAll()
      .where('primaryDocketEntryId', '==', orderDocketEntityId)
      .execute(),
  );
};
