import { remove } from '../../dynamodbClientService';

/**
 * deleteUserCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case the notes are associated with
 * @param {string} providers.userId the id of the user who owns the case notes
 * @returns {Array<Promise>} the promises for the persistence delete calls
 */
export const deleteUserCaseNote = ({
  applicationContext,
  docketNumber,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  userId: string;
}) =>
  remove({
    applicationContext,
    key: {
      pk: `user-case-note|${docketNumber}`,
      sk: `user|${userId}`,
    },
  });
