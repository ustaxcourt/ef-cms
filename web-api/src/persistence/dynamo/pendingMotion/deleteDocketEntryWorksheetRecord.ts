import { remove } from '../../dynamodbClientService';

/**
 * deleteCaseTrialSortMappingRecords
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to delete the mapping records for
 * @returns {Promise} the return from the persistence delete calls
 */
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
