const { get } = require('../requests');

/**
 * getUserCaseNoteInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number to get notes for the logged in user
 * @returns {Promise<*>} the promise of the api call
 */
exports.getUserCaseNoteInteractor = (applicationContext, { docketNumber }) => {
  return get({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}/user-notes`,
  });
};
