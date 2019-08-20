const { post } = require('../requests');

/**
 * createCaseNoteInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to add notes to
 * @param {string} providers.notes the notes to add to the case for the user
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCaseNoteInteractor = ({ applicationContext, caseId, notes }) => {
  return post({
    applicationContext,
    body: { notes },
    endpoint: `/cases/${caseId}/case-note`,
  });
};
