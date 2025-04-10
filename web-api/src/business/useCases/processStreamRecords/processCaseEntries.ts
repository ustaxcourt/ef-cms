import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { upsertCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/upsertCaseStatistics';
import { upsertPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { Statistic } from '@shared/business/entities/Statistic';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export const processCaseEntries = async ({
  caseEntityRecords,
}: {
  caseEntityRecords: any[];
}) => {
  if (!caseEntityRecords.length) return;

  const casesToUpsert: Record<string, any> = {};

  for (const caseRecord of caseEntityRecords) {
    const caseNewImage = unmarshall(caseRecord.dynamodb.NewImage);

    // Only upsert the most recent update of any duplicate case record since otherwise Postgres will throw an error.
    casesToUpsert[caseNewImage.docketNumber] = caseNewImage;
  }

  await upsertCases(Object.values(casesToUpsert));
  const postgresUpserts: Promise<void>[] = [];
  for (const caseRecord of Object.values(casesToUpsert)) {
    caseRecord.petitioners?.forEach(p => {
      p.hasConsentedToElectronicService = p?.hasConsentedToEService;
      p.hasElectronicAccess = p?.hasEAccess;
    });
    postgresUpserts.push(
      upsertPetitionersOnCase({
        docketNumber: caseRecord.docketNumber,
        petitionerCase: caseRecord,
      }),
    );
    postgresUpserts.push(
      upsertCaseStatusUpdates({
        docketNumber: caseRecord.docketNumber,
        statusUpdates: caseRecord.caseStatusHistory || [],
      }),
    );
    if (caseRecord.statistics) {
      postgresUpserts.push(
        upsertCaseStatistics({
          docketNumber: caseRecord.docketNumber,
          statistics: caseRecord.statistics.map(s => new Statistic(s)),
        }),
      );
    }
  }

  await Promise.all(postgresUpserts);
};
