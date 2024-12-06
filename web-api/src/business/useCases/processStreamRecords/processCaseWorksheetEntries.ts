import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { getLogger } from 'aws-xray-sdk';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { upsertCaseWorksheets } from '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets';

export const processCaseWorksheetEntries = async ({
  caseWorksheetRecords,
}: {
  caseWorksheetRecords: any[];
}) => {
  if (!caseWorksheetRecords.length) return;

  getLogger().debug(
    `going to upsert ${caseWorksheetRecords.length} case worksheet records`,
  );

  function getJudgeUserIdFromGs1pk(gs1pk?: string): string | null {
    if (!gs1pk) {
      return null;
    }
    const parts = gs1pk.split('|');
    return parts.length > 1 ? parts[1] : null;
  }

  await upsertCaseWorksheets(
    caseWorksheetRecords.map(record => {
      const unmarshalledData = unmarshall(record.dynamodb.NewImage);
      const judgeUserId = getJudgeUserIdFromGs1pk(unmarshalledData.gs1pk);
      return { ...unmarshalledData, judgeUserId } as RawCaseWorksheet;
    }),
  );
};
