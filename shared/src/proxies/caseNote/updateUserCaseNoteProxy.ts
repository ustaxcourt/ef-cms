const { put } = require('../requests');

/**
 * updateUserCaseNoteInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number to add notes to
 * @param {string} providers.notes the notes to add to the case for the user
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateUserCaseNoteInteractor = (
  applicationContext,
  { docketNumber, notes },
) => {
  return put({
    applicationContext,
    body: { notes },
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
