const { put } = require('../../dynamodbClientService');

/**
 * createCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.trialSessionWorkingCopy the trial session working copy data
 * @returns {Promise} the promise of the call to persistence
 */
exports.createCaseNote = async ({ applicationContext, caseNote }) => {
  return await put({
    Item: {
      pk: `case-note|${caseNote.caseId}`,
      sk: `${caseNote.userId}`,
      ...caseNote,
    },
    applicationContext,
  });
};
