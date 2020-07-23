const { get } = require('../requests');

/**
 * getUserCaseNoteForCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.docketNumbers the docket numbers to get notes for
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserCaseNoteForCasesInteractor = ({
  applicationContext,
  docketNumbers,
}) => {
  return get({
    applicationContext,
    endpoint: `/case-notes/batch-cases/${docketNumbers.join(',')}/user-notes`,
  });
};
