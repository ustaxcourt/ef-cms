const { remove } = require('../requests');

/**
 * deleteCaseNoteInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to delete note from
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCaseNoteInteractor = ({ applicationContext, caseId }) => {
  return remove({
    applicationContext,
    endpoint: `/case-notes/${caseId}/case-note`,
  });
};
