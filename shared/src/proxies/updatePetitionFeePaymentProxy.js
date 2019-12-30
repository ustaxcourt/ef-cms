const { put } = require('./requests');

/**
 * updatePetitionFeePaymentProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {string} providers.petitionPaymentDate the date the petition payment was made
 * @param {string} providers.petitionPaymentMethod notes on method of payment (e.g. check)
 * @param {string} providers.petitionPaymentStatus the status (paid, unpaid, waived)
 * @param {string} providers.petitionPaymentWaivedDate the date on which petition fee payment was waived
 * @returns {Promise<*>} the promise of the api call
 */
exports.updatePetitionFeePaymentInteractor = ({
  applicationContext,
  caseId,
  petitionPaymentDate,
  petitionPaymentMethod,
  petitionPaymentStatus,
  petitionPaymentWaivedDate,
}) => {
  return put({
    applicationContext,
    body: {
      petitionPaymentDate,
      petitionPaymentMethod,
      petitionPaymentStatus,
      petitionPaymentWaivedDate,
    },
    endpoint: `/cases/${caseId}/petition-fee`,
  });
};
