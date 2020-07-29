const { put } = require('./requests');

/**
 * saveCaseDetailInternalEditInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {Promise<*>} the promise of the api call
 */
exports.saveCaseDetailInternalEditInteractor = ({
  applicationContext,
  caseToUpdate,
}) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.docketNumber}`,
  });
};
