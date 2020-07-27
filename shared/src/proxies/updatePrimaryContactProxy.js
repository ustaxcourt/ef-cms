const { put } = require('./requests');

/**
 * updatePrimaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update the primary contact
 * @param {object} providers.contactInfo the contact info to update on the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.updatePrimaryContactInteractor = ({
  applicationContext,
  contactInfo,
  docketNumber,
}) => {
  return put({
    applicationContext,
    body: { contactInfo, docketNumber },
    endpoint: `/case-parties/${docketNumber}/contact-primary`,
  });
};
