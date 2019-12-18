const { get } = require('../requests');

/**
 * getJudgesCaseNoteInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get notes for the logged in user
 * @returns {Promise<*>} the promise of the api call
 */
exports.getJudgesCaseNoteInteractor = ({ applicationContext, caseId }) => {
  return get({
    applicationContext,
    endpoint: `/case-notes/judges/${caseId}`,
  });
};
