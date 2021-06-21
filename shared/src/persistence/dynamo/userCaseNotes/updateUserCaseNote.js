const client = require('../../dynamodbClientService');

/**
 * updateUserCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseNoteToUpdate the case note data to update
 * @returns {Promise} the promise of the call to persistence
 */
exports.updateUserCaseNote = async ({
  applicationContext,
  caseNoteToUpdate,
}) => {
  return await client.put({
    Item: {
      ...caseNoteToUpdate,
      pk: `user-case-note|${caseNoteToUpdate.docketNumber}`,
      sk: `user|${caseNoteToUpdate.userId}`,
    },
    applicationContext,
  });
};
