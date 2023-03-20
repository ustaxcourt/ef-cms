const { post } = require('../requests');

/**
 * associateIrsPractitionerWithCaseInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} params the params object
 * @param {string} params.docketNumber the docket number of the case
 * @param {string} params.serviceIndicator the type of service the irsPractitioner should receive
 * @param {string} params.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
exports.associateIrsPractitionerWithCaseInteractor = (
  applicationContext,
  { docketNumber, serviceIndicator, userId },
) => {
  return post({
    applicationContext,
    body: { docketNumber, serviceIndicator, userId },
    endpoint: `/case-parties/${docketNumber}/associate-irs-practitioner`,
  });
};
