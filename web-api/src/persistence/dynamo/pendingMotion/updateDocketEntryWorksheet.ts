import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { put } from '../../dynamodbClientService';

export const updateDocketEntryWorksheet = async ({
  applicationContext,
  docketEntryWorksheet,
  judgeUserId,
}: {
  applicationContext: IApplicationContext;
  docketEntryWorksheet: RawDocketEntryWorksheet;
  judgeUserId: string;
}): Promise<TDynamoRecord> => {
  return await put({
    Item: {
      gsi1pk: `judge-case-worksheet|${judgeUserId}`,
      pk: `docket-entry|${docketEntryWorksheet.docketEntryId}`,
      sk: `docket-entry-worksheet|${docketEntryWorksheet.docketEntryId}`,
      ...docketEntryWorksheet,
      judgeUserId,
    },
    applicationContext,
  });
};
