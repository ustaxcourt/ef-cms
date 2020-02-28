const { get } = require('../requests');

/**
 * getUserCaseNoteForCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get notes for the logged in user
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserCaseNoteForCasesInteractor = ({
  applicationContext,
  caseIds,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-notes/batch-cases/${caseIds.join(',')}/user-notes`,
  });
};
