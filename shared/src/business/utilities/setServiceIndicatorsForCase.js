const {
  isUserIdRepresentedByPrivatePractitioner,
} = require('../entities/cases/Case');
const { SERVICE_INDICATOR_TYPES } = require('../entities/EntityConstants');

/**
 * sets the service indicators for parties on the given case
 *
 * @param {object} caseDetail case to set service indicators on
 * @returns {object} service indicators for petitioner, privatePractitioners, and irsPractitioners
 */
const setServiceIndicatorsForCase = caseDetail => {
  const { petitioners } = caseDetail;

  petitioners?.forEach(petitioner => {
    if (!petitioner.serviceIndicator) {
      if (
        isUserIdRepresentedByPrivatePractitioner(
          caseDetail,
          petitioner.contactId,
        )
      ) {
        petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
      } else {
        const serviceIsPaper = !petitioner.email;
        petitioner.serviceIndicator = serviceIsPaper
          ? SERVICE_INDICATOR_TYPES.SI_PAPER
          : SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }
    }
  });

  return caseDetail;
};

module.exports = {
  setServiceIndicatorsForCase,
};
