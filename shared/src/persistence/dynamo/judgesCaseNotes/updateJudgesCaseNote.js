const client = require('../../dynamodbClientService');

/**
 * updateJudgesCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseNoteToUpdate the case note data to update
 * @returns {Promise} the promise of the call to persistence
 */
exports.updateJudgesCaseNote = async ({
  applicationContext,
  caseNoteToUpdate,
}) => {
  return await client.put({
    Item: {
      pk: `judges-case-note|${caseNoteToUpdate.caseId}`,
      sk: `${caseNoteToUpdate.userId}`,
      ...caseNoteToUpdate,
    },
    applicationContext,
  });
};
