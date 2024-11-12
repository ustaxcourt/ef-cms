import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { getLogger } from 'aws-xray-sdk';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/correspondence/upsertCaseCorrespondences';

export const processCorrespondences = async ({
  correspondenceRecords,
}: {
  correspondenceRecords: any[];
}) => {
  if (!correspondenceRecords.length) return;

  getLogger().debug(
    `going to index ${correspondenceRecords.length} correspondence records`,
  );

  await upsertCaseCorrespondences(
    correspondenceRecords.map(record => {
      return unmarshall(record.dynamodb.NewImage) as RawCorrespondence;
    }),
  );
};
