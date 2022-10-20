import { put } from '../../dynamodbClientService';

/**
 * updateUserCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseNoteToUpdate the case note data to update
 * @returns {Promise} the promise of the call to persistence
 */
export const updateUserCaseNote = ({
  applicationContext,
  caseNoteToUpdate,
}: {
  applicationContext: IApplicationContext;
  caseNoteToUpdate: TCaseNote;
}) =>
  put({
    Item: {
      ...caseNoteToUpdate,
      pk: `user-case-note|${caseNoteToUpdate.docketNumber}`,
      sk: `user|${caseNoteToUpdate.userId}`,
    },
    applicationContext,
  });
