const { put } = require('../requests');

/**
 * saveCaseNoteInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to add notes to
 * @param {string} providers.caseNote the notes to add
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveCaseNoteInteractor = ({
  applicationContext,
  caseNote,
  docketNumber,
}) => {
  return put({
    applicationContext,
    body: { caseNote },
    endpoint: `/case-notes/${docketNumber}`,
  });
};
