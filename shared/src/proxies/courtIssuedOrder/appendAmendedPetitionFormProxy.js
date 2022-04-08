const { post } = require('../requests');

/**
 * appendAmendedPetitionFormProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.orderContent the order content to append the form to
 * @returns {Promise<*>} the promise of the api call
 */
exports.appendAmendedPetitionFormInteractor = (
  applicationContext,
  { orderContent },
) => {
  return post({
    applicationContext,
    body: {
      orderContent,
    },
    endpoint: '/case-documents/append-pdf',
  });
};
