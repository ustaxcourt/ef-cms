const { put } = require('../../dynamodbClientService');

/**
 * createCaseNote
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseNote the case note data
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
