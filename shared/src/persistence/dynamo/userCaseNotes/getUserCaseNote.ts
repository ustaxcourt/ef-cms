import { get } from '../../dynamodbClientService';

/**
 * getUserCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to get the case notes for
 * @param {string} providers.userId the id of the user to get the case notes for
 * @returns {Promise} the promise of the persistence call to get the record
 */
export const getUserCaseNote = ({
  applicationContext,
  docketNumber,
  userId,
}: {
  applicationContext: IApplicationContext;
  docketNumber: string;
  userId: string;
}) =>
  get({
    Key: {
      pk: `user-case-note|${docketNumber}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
