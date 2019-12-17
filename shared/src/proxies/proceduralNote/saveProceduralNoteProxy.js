const { put } = require('../requests');

/**
 * saveProceduralNoteProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to add notes to
 * @param {string} providers.note the notes to add to the case for the user
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveProceduralNoteProxy = ({ applicationContext, caseId, note }) => {
  return put({
    applicationContext,
    body: { note },
    endpoint: `/case-notes/procedural/${caseId}`,
  });
};
