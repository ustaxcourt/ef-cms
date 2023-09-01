import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { put } from '../../dynamodbClientService';

export const updateCaseWorksheet = async ({
  applicationContext,
  caseWorksheet,
  judgeUserId,
}: {
  applicationContext: IApplicationContext;
  caseWorksheet: RawCaseWorksheet;
  judgeUserId: string;
}): Promise<void> => {
  put({
    Item: {
      gsi1pk: `judge-case-worksheet|${judgeUserId}`,
      pk: `case|${caseWorksheet.docketNumber}`,
      sk: `case-worksheet|${caseWorksheet.caseWorksheetId}`,
      ...caseWorksheet,
    },
    applicationContext,
  });
};
