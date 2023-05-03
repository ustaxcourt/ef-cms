import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';
import { isUserIdRepresentedByPrivatePractitioner } from '../entities/cases/Case';

/**
 * sets the service indicators for parties on the given case
 * @param {object} caseDetail case to set service indicators on
 * @returns {object} service indicators for petitioner, privatePractitioners, and irsPractitioners
 */
export const setServiceIndicatorsForCase = caseDetail => {
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
