import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { getDawsonLogger } from '@web-api/utilities/logger/getLogger';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertCaseWorksheets } from '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets';

export const processCaseWorksheetEntries = async ({
  caseWorksheetRecords,
}: {
  caseWorksheetRecords: any[];
}) => {
  if (!caseWorksheetRecords.length) return;

  getDawsonLogger().debug(
    `going to upsert ${caseWorksheetRecords.length} case worksheet records`,
  );

  function getJudgeUserIdFromGsi1pk(gsi1pk?: string): string | null {
    if (!gsi1pk) {
      return null;
    }
    const parts = gsi1pk.split('|');
    return parts.length > 1 ? parts[1] : null;
  }

  await upsertCaseWorksheets(
    caseWorksheetRecords.map(record => {
      const unmarshalledData = unmarshall(record.dynamodb.NewImage);
      const judgeUserId = getJudgeUserIdFromGsi1pk(unmarshalledData.gsi1pk);
      return { ...unmarshalledData, judgeUserId } as RawCaseWorksheet;
    }),
  );
};
