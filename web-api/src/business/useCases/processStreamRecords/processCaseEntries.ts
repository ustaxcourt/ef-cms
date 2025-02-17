import { NotFoundError } from '@web-api/errors/errors';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import type { ServerApplicationContext } from '@web-api/applicationContext';
import { upsertCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/upsertCaseStatistics';
import { upsertPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { Statistic } from '@shared/business/entities/Statistic';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';

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

  const postgresUpserts: Promise<void>[] = [
    upsertCases(Object.values(casesToUpsert)),
  ];
  for (const caseRecord of Object.values(casesToUpsert)) {
    postgresUpserts.push(
      upsertPetitionersOnCase({
        docketNumber: caseRecord.docketNumber,
        petitioners: caseRecord.petitioners.map(p => new Petitioner(p)),
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
