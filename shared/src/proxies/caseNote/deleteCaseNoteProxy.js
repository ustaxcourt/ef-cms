const { remove } = require('../requests');

/**
 * deleteCaseNoteInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number to delete note from
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCaseNoteInteractor = (applicationContext, { docketNumber }) => {
  return remove({
    applicationContext,
    endpoint: `/case-notes/${docketNumber}`,
  });
};
