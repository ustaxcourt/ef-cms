import { RawCorrespondence } from '@shared/business/entities/Correspondence';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';

export const processCaseCorrespondenceEntries = async ({
  caseCorrespondenceRecords,
}: {
  caseCorrespondenceRecords: any[];
}) => {
  if (!caseCorrespondenceRecords.length) return;

  getDawsonLogger().debug(
    `going to upsert ${caseCorrespondenceRecords.length} correspondence records`,
  );

  function getDocketNumberFromPk(pk?: string) {
    if (!pk) {
      throw new Error('Case Correspondence is missing a pk');
    }
    const parts = pk.split('|');
    if (parts.length > 1 && parts[1].length) {
      return parts[1];
    }
    throw new Error(`Case Correspondence pk of ${pk} is improperly formatted`);
  }

  await upsertCaseCorrespondences(
    caseCorrespondenceRecords.map(record => {
      const unmarshalledData = unmarshall(record.dynamodb.NewImage);
      const docketNumber = getDocketNumberFromPk(unmarshalledData.pk);
      return { ...unmarshalledData, docketNumber } as RawCorrespondence;
    }),
  );
};
