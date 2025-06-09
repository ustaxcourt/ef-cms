import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertDocketEntryWorksheets } from '@web-api/persistence/postgres/docketEntryWorksheets/upsertDocketEntryWorksheets';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processDocketEntryWorksheetEntries = async ({
  docketEntryWorksheetRecords,
}: {
  docketEntryWorksheetRecords: any[];
}) => {
  try {
    if (!docketEntryWorksheetRecords.length) return;

    getDawsonLogger().debug(
      `going to upsert ${docketEntryWorksheetRecords.length} docket entry worksheet records`,
    );

    const docketEntryWorksheets: any[] = docketEntryWorksheetRecords.map(
      record => unmarshall(record.dynamodb.NewImage),
    );

    await upsertDocketEntryWorksheets({ docketEntryWorksheets });
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process docket entry worksheet record: ${e}`,
    );
  }
};
