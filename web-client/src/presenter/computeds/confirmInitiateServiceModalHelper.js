import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';

/**
 * returns computed values for the confirm initiate service modal
 *
 * @param {Function} get the cerebral get function used
 * @param {object} applicationContext the application context
 * for getting state.caseDetail.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const confirmInitiateServiceModalHelper = (get, applicationContext) => {
  const { CONTACT_TYPE_TITLES, SERVICE_INDICATOR_TYPES } =
    applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);

  const formattedCase = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase({
      ...get(state.caseDetail),
    });

  const parties = {
    petitioner: caseDetail.petitioners,
    privatePractitioners: formattedCase.privatePractitioners,
    respondent: formattedCase.irsPractitioners,
  };

  const contactsNeedingPaperService = [];

  const roleToDisplay = party => {
    if (party.role === ROLES.privatePractitioner) {
      return 'Petitioner Counsel';
    } else if (party.role === ROLES.irsPractitioner) {
      return 'Respondent Counsel';
    } else {
      return CONTACT_TYPE_TITLES[party.contactType];
    }
  };

  Object.keys(parties).forEach(key => {
    parties[key].forEach(party => {
      if (
        party &&
        party.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER
      ) {
        contactsNeedingPaperService.push({
          name: `${party.name}, ${roleToDisplay(party)}`,
        });
      }
    });
  });

  return {
    contactsNeedingPaperService,
    showPaperAlert: contactsNeedingPaperService.length > 0,
  };
};
