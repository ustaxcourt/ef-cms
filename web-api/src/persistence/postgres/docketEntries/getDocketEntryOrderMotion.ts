import { DocketEntryOrderMotionKysely } from '@web-api/persistence/postgres/docketEntries/schema';
import { getDbReader } from 'web-api/src/persistence/postgres/database';

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
