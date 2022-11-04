const { put } = require('../requests');

/**
 * editPractitionerDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.user the user data
 * @returns {Promise<object>} the created user data
 */
exports.editPractitionerDocumentInteractor = (
  applicationContext,
  { barNumber, documentMetadata },
) => {
  return put({
    applicationContext,
    body: documentMetadata,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
