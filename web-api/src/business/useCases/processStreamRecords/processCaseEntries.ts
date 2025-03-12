import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { upsertCaseStatistics } from '@web-api/persistence/postgres/cases/statistics/upsertCaseStatistics';
import { upsertPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { upsertCaseStatusUpdates } from '@web-api/persistence/postgres/cases/upsertCaseStatusUpdates';
import { Statistic } from '@shared/business/entities/Statistic';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const processCaseEntries = async ({
  caseEntityRecords,
}: {
  caseEntityRecords: any[];
}) => {
  try {
    getLogger().error('processCaseEntries count:', caseEntityRecords.length);
    if (!caseEntityRecords.length) return;

    const casesToUpsert: Record<string, any> = {};

    for (const caseRecord of caseEntityRecords) {
      getLogger().error(`attempting to unmarshall ${caseRecord.docketNumber}`);
      const caseNewImage = unmarshall(caseRecord.dynamodb.NewImage);
      getLogger().error(`successfully unmarshalled ${caseRecord.docketNumber}`);

      // Only upsert the most recent update of any duplicate case record since otherwise Postgres will throw an error.
      casesToUpsert[caseNewImage.docketNumber] = caseNewImage;
    }

    for (const caseRecord of Object.values(casesToUpsert)) {
      getLogger().error(`Attempting to upsert ${caseRecord.docketNumber}`);
      await upsertCases([caseRecord]);
      getLogger().error(
        `Attempting to upsert ${caseRecord.petitioners.map(p => p.contactId)}`,
      );
      await upsertPetitionersOnCase({
        docketNumber: caseRecord.docketNumber,
        petitionerCase: caseRecord,
      });
      getLogger().error(
        `Attempting to upsert ${caseRecord.caseStatusHistory?.map(s => s.statusUpdateId)}`,
      );
      await upsertCaseStatusUpdates({
        docketNumber: caseRecord.docketNumber,
        statusUpdates: caseRecord.caseStatusHistory || [],
      });
      getLogger().error(
        `Attempting to upsert ${caseRecord.statistics?.map(s => s.statisticId)}`,
      );
      await upsertCaseStatistics({
        docketNumber: caseRecord.docketNumber,
        statistics: caseRecord.statistics.map(s => new Statistic(s)),
      });
      getLogger().error(`Successfully upsert ${caseRecord.docketNumber}`);
    }
  } catch (e) {
    getLogger().error(`Failed to processCaseEntries: ${e}`);
  }
};
