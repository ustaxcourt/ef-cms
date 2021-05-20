const { put } = require('./requests');

/**
 * sealCaseContactAddressInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.contactId the contactId corresponding to the address to be sealed
 * @param {string} providers.docketNumber the docket number of the case to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.sealCaseContactAddressInteractor = (
  applicationContext,
  { contactId, docketNumber },
) => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/seal-address/${contactId}`,
  });
};
