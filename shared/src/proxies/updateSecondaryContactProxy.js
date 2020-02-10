const { put } = require('./requests');

/**
 * updateSecondaryContactInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update the secondary contact
 * @param {object} providers.contactInfo the contact info to update on the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateSecondaryContactInteractor = ({
  applicationContext,
  caseId,
  contactInfo,
}) => {
  return put({
    applicationContext,
    body: { caseId, contactInfo },
    endpoint: `/case-parties/${caseId}/contact-secondary`,
  });
};
