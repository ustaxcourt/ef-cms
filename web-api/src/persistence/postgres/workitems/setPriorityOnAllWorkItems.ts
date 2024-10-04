import { getDbWriter } from '@web-api/database';

/**
 * setPriorityOnAllWorkItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber docket number to update work items for
 * @param {boolean} providers.highPriority true if the work items should be set high priority, false otherwise
 * @param {string} providers.trialDate the date of the trial or undefined
 * @returns {Promise} the promise of the persistence calls
 */
export const setPriorityOnAllWorkItems = async ({
  docketNumber,
  highPriority,
}: {
  docketNumber: string;
  highPriority: boolean;
  trialDate?: string;
}) => {
  await getDbWriter(writer => {
    let builder = writer
      .updateTable('dwWorkItem')
      .set('highPriority', highPriority);

    return builder.where('docketNumber', '=', docketNumber).execute();
  });
};
