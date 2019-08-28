const { put } = require('../requests');

/**
 * updateUserContactInformationInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.contactInfo the contactInfo to update the contact info
 * @param {string} providers.userId the userId to update the contact info
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateUserContactInformationInteractor = ({
  applicationContext,
  contactInfo,
  userId,
}) => {
  return put({
    applicationContext,
    body: contactInfo,
    endpoint: `/users/${userId}/contact-info`,
  });
};
