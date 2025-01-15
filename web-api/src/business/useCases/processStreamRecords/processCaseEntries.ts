import { NotFoundError } from '@web-api/errors/errors';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import type { IDynamoDBRecord } from '@web-api/business/useCases/processStreamRecords/processStreamUtilities';
import type { ServerApplicationContext } from '@web-api/applicationContext';

export const processCaseEntries = async ({
  applicationContext,
  caseEntityRecords,
}: {
  applicationContext: ServerApplicationContext;
  caseEntityRecords: any[];
}) => {
  if (!caseEntityRecords.length) return;

  const casesToUpsert: RawCase[] = [];

  async caseRecord => {
    const caseNewImage = caseRecord.dynamodb.NewImage;
    const caseRecords: IDynamoDBRecord[] = [];

    const caseMetadataWithCounsel = await getCaseMetadataWithCounsel({
      applicationContext,
      docketNumber: caseNewImage.docketNumber.S,
    });

    if (!caseMetadataWithCounsel) {
      throw new NotFoundError(`Case ${caseNewImage.docketNumber.S} not found`);
    }

    casesToUpsert.push(caseMetadataWithCounsel);

    return caseRecords;
  };

  await upsertCases(casesToUpsert);
};
