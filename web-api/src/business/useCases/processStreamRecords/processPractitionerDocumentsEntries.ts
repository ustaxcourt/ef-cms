import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertPractitionerDocuments } from '@web-api/persistence/postgres/practitionerDocuments/upsertPractitionerDocuments';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processPractitionerDocumentsEntries = async ({
  practitionerDocumentRecords: records,
}: {
  practitionerDocumentRecords: any[];
}) => {
  if (!records.length) return;

  try {
    getDawsonLogger().debug(
      `going to index ${records.length} practitioner documents`,
    );

    const pgPractitionerDocuments: any[] = [];

    for (const record of records) {
      const unmarshalledRecord = unmarshall(record.dynamodb.NewImage);
      const barNumber = unmarshalledRecord.pk.split('|')[1];
      pgPractitionerDocuments.push({ ...unmarshalledRecord, barNumber });
    }

    await upsertPractitionerDocuments(pgPractitionerDocuments);
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process practitioner document entry record: ${e}`,
    );
  }
};
