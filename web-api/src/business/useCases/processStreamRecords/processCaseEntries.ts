import { NotFoundError } from '@web-api/errors/errors';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processCaseEntries = async ({
  applicationContext,
  caseEntityRecords,
}: {
  applicationContext: ServerApplicationContext;
  caseEntityRecords: any[];
}) => {
  if (!caseEntityRecords.length) return;

  const casesToUpsert: Record<string, RawCase> = {};

  for (const caseRecord of caseEntityRecords) {
    const caseNewImage = caseRecord.dynamodb.NewImage;

    const caseMetadataWithCounsel = await getCaseMetadataWithCounsel({
      applicationContext,
      docketNumber: caseNewImage.docketNumber.S,
    });

    if (!caseMetadataWithCounsel) {
      throw new NotFoundError(`Case ${caseNewImage.docketNumber.S} not found`);
    }

    // Only upsert the most recent update of any duplicate case record since otherwise Postgres will throw an error.
    casesToUpsert[caseMetadataWithCounsel.docketNumber] =
      caseMetadataWithCounsel;
  }

  await upsertCases(Object.values(casesToUpsert));
};
