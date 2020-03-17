const { post } = require('../requests');

/**
 * associatePrivatePractitionerWithCaseInteractorProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {boolean} params.representingPrimary whether the practitioner is
 * representing the primary contact
 * @param {boolean} params.representingSecondary whether the practitioner is
 * representing the secondary contact
 * @param {string} params.userId the user id
 * @param {string} params.serviceIndicator the service indicator for the petitioner counsel (electronic, paper, none)
 * @returns {Promise<*>} the promise of the api call
 */
exports.associatePrivatePractitionerWithCaseInteractor = ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
  serviceIndicator,
  userId,
}) => {
  return post({
    applicationContext,
    body: {
      caseId,
      representingPrimary,
      representingSecondary,
      serviceIndicator,
      userId,
    },
    endpoint: `/case-parties/${caseId}/associate-private-practitioner`,
  });
};
