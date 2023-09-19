import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { put } from '../../dynamodbClientService';

export const updateCaseWorksheet = async ({
  applicationContext,
  caseWorksheet,
  judgeUserId,
}: {
  applicationContext: IApplicationContext;
  caseWorksheet: RawCaseWorksheet;
  judgeUserId: string;
}): Promise<TDynamoRecord> => {
  return await put({
    Item: {
      gsi1pk: `judge-case-worksheet|${judgeUserId}`,
      pk: `case|${caseWorksheet.docketNumber}`,
      sk: `case-worksheet|${caseWorksheet.docketNumber}`,
      ...caseWorksheet,
    },
    applicationContext,
  });
};
