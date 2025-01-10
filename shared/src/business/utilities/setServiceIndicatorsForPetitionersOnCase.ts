import { Case } from '../entities/cases/Case';
import { SERVICE_INDICATOR_TYPES } from '../entities/EntityConstants';

export const setServiceIndicatorsForPetitionersOnCase = caseDetail => {
  const { petitioners } = caseDetail;

  petitioners?.forEach(petitioner => {
    if (petitioner.serviceIndicator) {
      return;
    }
    if (Case.isPetitionerRepresented(caseDetail, petitioner.contactId)) {
      petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
    } else {
      const serviceIsPaper = !petitioner.email;
      petitioner.serviceIndicator = serviceIsPaper
        ? SERVICE_INDICATOR_TYPES.SI_PAPER
        : SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    }
  });

  return caseDetail;
};
