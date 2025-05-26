import { getLogger } from '@web-api/utilities/logger/getLogger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertDocketEntryWorksheets } from '@web-api/persistence/postgres/docketEntryWorksheets/upsertDocketEntryWorksheets';

export const processDocketEntryWorksheetEntries = async ({
  docketEntryWorksheetRecords,
}: {
  docketEntryWorksheetRecords: any[];
}) => {
  try {
    if (!docketEntryWorksheetRecords.length) return;

    getLogger().debug(
      `going to upsert ${docketEntryWorksheetRecords.length} docket entry worksheet records`,
    );

    const docketEntryWorksheets: any[] = docketEntryWorksheetRecords.map(
      record => unmarshall(record.dynamodb.NewImage),
    );

    await upsertDocketEntryWorksheets({ docketEntryWorksheets });
  } catch (e) {
    getLogger().error(
      `Postgres re-indexing failure: Failed to process docket entry worksheet record: ${e}`,
    );
  }
};
