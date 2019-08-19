const { post } = require('../requests');

/**
 * associatePractitionerWithCaseInteractorProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {boolean} params.representingPrimary whether the practitioner is
 * representing the primary contact
 * @param {boolean} params.representingSecondary whether the practitioner is
 * representing the secondary contact
 * @param {string} params.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
exports.associatePractitionerWithCaseInteractor = ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
  userId,
}) => {
  return post({
    applicationContext,
    body: { caseId, representingPrimary, representingSecondary, userId },
    endpoint: `/cases/${caseId}/associate-practitioner`,
  });
};
