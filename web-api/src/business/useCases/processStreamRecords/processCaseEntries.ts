import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export const processCaseEntries = async ({
  caseEntityRecords,
}: {
  caseEntityRecords: any[];
}) => {
  if (!caseEntityRecords.length) return;

  try {
    const casesToUpsert: Record<string, any> = {};

    for (const caseRecord of caseEntityRecords) {
      const caseNewImage = unmarshall(caseRecord.dynamodb.NewImage);

      // Only upsert the most recent update of any duplicate case record since otherwise Postgres will throw an error.
      casesToUpsert[caseNewImage.docketNumber] = caseNewImage;
    }

    for (const caseRecord of Object.values(casesToUpsert)) {
      caseRecord.petitioners?.forEach(p => {
        p.hasConsentedToElectronicService = p?.hasConsentedToEService;
        p.hasElectronicAccess = p?.hasEAccess;
      });
    }

    await upsertCases(Object.values(casesToUpsert));
  } catch (e) {
    getDawsonLogger().error(
      `Postgres re-indexing failure: Failed to process case record: `,
      e,
    );
  }
};
