const { post } = require('../requests');

/**
 * associatePrivatePractitionerWithCaseInteractorProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.docketNumber the docket number of the case
 * @param {Array} params.filers the contact ids the private practitioner is representing
 * @param {string} params.userId the user id
 * @param {string} params.serviceIndicator the service indicator for the petitioner counsel (electronic, paper, none)
 * @returns {Promise<*>} the promise of the api call
 */
exports.associatePrivatePractitionerWithCaseInteractor = ({
  applicationContext,
  docketNumber,
  filers,
  serviceIndicator,
  userId,
}) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      filers,
      serviceIndicator,
      userId,
    },
    endpoint: `/case-parties/${docketNumber}/associate-private-practitioner`,
  });
};
