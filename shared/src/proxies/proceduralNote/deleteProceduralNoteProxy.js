const { remove } = require('../requests');

/**
 * deleteProceduralNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to delete note from
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteProceduralNoteInteractor = ({ applicationContext, caseId }) => {
  return remove({
    applicationContext,
    endpoint: `/case-notes/procedural/${caseId}`,
  });
};
