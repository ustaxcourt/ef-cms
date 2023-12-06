import { remove } from '../../dynamodbClientService';

export const deleteDocketEntryWorksheetRecord = async ({
  applicationContext,
  docketEntryId,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
}): Promise<void> =>
  await remove({
    applicationContext,
    key: {
      pk: `docket-entry|${docketEntryId}`,
      sk: `docket-entry-worksheet|${docketEntryId}`,
    },
  });
