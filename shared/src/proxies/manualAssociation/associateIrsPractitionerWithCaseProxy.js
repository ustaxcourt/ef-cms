const { post } = require('../requests');

/**
 * associateIrsPractitionerWithCaseInteractorProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {string} params.serviceIndicator the type of service the irsPractitioner should receive
 * @param {string} params.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
exports.associateIrsPractitionerWithCaseInteractor = ({
  applicationContext,
  caseId,
  serviceIndicator,
  userId,
}) => {
  return post({
    applicationContext,
    body: { caseId, serviceIndicator, userId },
    endpoint: `/case-parties/${caseId}/associate-irs-practitioner`,
  });
};
