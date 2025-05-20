import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getLogger } from '@web-api/utilities/logger/getLogger';

/**
 * fetches the latest version of the case from dynamodb and re-indexes this docket-entries combined with the latest case info.
 *
 * @param {array} docketEntryRecords all of the event stream records associated with docket entries
 */
export const processDocketEntries = async ({
  docketEntryRecords: records,
}: {
  docketEntryRecords: any[];
}) => {
  if (!records.length) return;

  try {
    getLogger().debug(`going to index ${records.length} docketEntryRecords`);

    const pgDocketEntries: Record<string, RawDocketEntry> = {};

    for (const record of records) {
      const unmarshalledRecord = unmarshall(record.dynamodb.NewImage);
      const key =
        unmarshalledRecord.docketNumber + unmarshalledRecord.docketEntryId;
      // Only upsert the most recent update of any duplicate docket entry record since otherwise Postgres will throw an error.
      pgDocketEntries[key] = unmarshalledRecord as RawDocketEntry;
    }
    const docketEntries = Object.values(pgDocketEntries);
    const validatedEntries = DocketEntry.validateRawCollection(docketEntries, {
      authorizedUser: {
        email: 'system@ustc.gov',
        name: 'ustc automated system',
        role: 'docketclerk',
        userId: 'N/A',
      },
    });
    await upsertDocketEntries(validatedEntries);
  } catch (e) {
    getLogger().error(
      `Postgres re-indexing failure: Failed to process docket entry records: ${e}`,
    );
  }
};
