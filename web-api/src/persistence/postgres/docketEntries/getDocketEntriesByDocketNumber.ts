import { getDbReader } from '@web-api/database';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';

export const getDocketEntriesByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawDocketEntry[]> => {
  const dbDocketEntries = await getDbReader(reader =>
    reader
      .selectFrom('dwDocketEntry as de')
      .leftJoin('dwDocketEntryOrderMotion as deom', join =>
        join
          .onRef('de.docketEntryId', '=', 'deom.motionDocketEntryId')
          .onRef('de.docketNumber', '=', 'deom.motionDocketNumber'),
      )
      .where('docketNumber', '=', docketNumber)
      .selectAll('de')
      .select('deom.disposition as motionDisposition')
      .select('deom.orderDocketEntryId')
      .execute(),
  );

  return dbDocketEntries.map(d => fromKyselyDocketEntry(d));
};
