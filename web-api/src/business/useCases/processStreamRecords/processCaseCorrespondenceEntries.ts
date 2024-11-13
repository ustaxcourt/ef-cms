import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { getLogger } from 'aws-xray-sdk';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';

export const processCaseCorrespondenceEntries = async ({
  caseCorrespondenceRecords,
}: {
  caseCorrespondenceRecords: any[];
}) => {
  if (!caseCorrespondenceRecords.length) return;

  getLogger().debug(
    `going to upsert ${caseCorrespondenceRecords.length} correspondence records`,
  );

  await upsertCaseCorrespondences(
    caseCorrespondenceRecords.map(record => {
      return unmarshall(record.dynamodb.NewImage) as RawCorrespondence;
    }),
  );
};
