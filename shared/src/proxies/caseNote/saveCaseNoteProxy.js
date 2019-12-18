const { put } = require('../requests');

/**
 * saveCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to add notes to
 * @param {string} providers.caseNote the notes to add
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveCaseNoteInteractor = ({ applicationContext, caseId, caseNote }) => {
  return put({
    applicationContext,
    body: { caseNote },
    endpoint: `/case-notes/${caseId}`,
  });
};
