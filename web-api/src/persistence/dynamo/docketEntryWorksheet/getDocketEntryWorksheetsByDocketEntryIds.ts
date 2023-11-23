import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { batchGet } from '../../dynamodbClientService';

export const getDocketEntryWorksheetsByDocketEntryIds = async ({
  applicationContext,
  docketEntryIds,
}: {
  applicationContext: IApplicationContext;
  docketEntryIds: string[];
}): Promise<RawDocketEntryWorksheet[]> => {
  const result = await batchGet({
    applicationContext,
    keys: docketEntryIds.map(docketEntryId => ({
      pk: `docket-entry|${docketEntryId}`,
      sk: `docket-entry-worksheet|${docketEntryId}`,
    })),
  });

  return result.map(item => new DocketEntryWorksheet(item).toRawObject());
};
