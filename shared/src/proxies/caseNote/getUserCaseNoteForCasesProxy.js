const { post } = require('../requests');

/**
 * getUserCaseNoteForCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array<string>} providers.docketNumbers the docket numbers to get notes for
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserCaseNoteForCasesInteractor = (
  applicationContext,
  { docketNumbers },
) => {
  return post({
    applicationContext,
    body: docketNumbers,
    endpoint: '/case-notes/batch-cases/user-notes',
  });
};
