const { get } = require('../requests');

/**
 * getUserCaseNoteInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get notes for the logged in user
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserCaseNoteInteractor = ({ applicationContext, caseId }) => {
  return get({
    applicationContext,
    endpoint: `/case-notes/${caseId}/user-notes`,
  });
};
