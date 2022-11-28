import { remove } from '../../dynamodbClientService';

/**
 * deleteDocketEntry
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the record to delete from
 * @param {object} providers.docketEntryId the docketEntryId of the record to delete
 */
export const deleteDocketEntry = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}: {
  applicationContext: IApplicationContext;
  docketEntryId: string;
  docketNumber: string;
}) =>
  remove({
    applicationContext,
    key: {
      pk: `case|${docketNumber}`,
      sk: `docket-entry|${docketEntryId}`,
    },
  });
