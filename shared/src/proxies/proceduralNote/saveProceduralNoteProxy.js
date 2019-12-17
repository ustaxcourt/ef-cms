const { put } = require('../requests');

/**
 * saveProceduralNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to add notes to
 * @param {string} providers.proceduralNote the procedural notes to add
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveProceduralNoteInteractor = ({
  applicationContext,
  caseId,
  proceduralNote,
}) => {
  return put({
    applicationContext,
    body: { proceduralNote },
    endpoint: `/case-notes/procedural/${caseId}`,
  });
};
