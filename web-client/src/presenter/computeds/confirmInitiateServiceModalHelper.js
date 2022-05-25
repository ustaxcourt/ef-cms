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

  const formattedCaseDetail = get(state.formattedCaseDetail);

  let parties;
  if (formattedCaseDetail.consolidatedCases) {
    parties = formattedCaseDetail.consolidatedCases.reduce(
      (aggregatedParties, aCase) => {
        aggregatedParties.petitioner = aggregatedParties.petitioner.concat(
          aCase.petitioners,
        );
        aggregatedParties.privatePractitioners =
          aggregatedParties.privatePractitioners.concat(
            aCase.privatePractitioners,
          );
        aggregatedParties.respondent = aggregatedParties.respondent.concat(
          aCase.respondent,
        );

        return aggregatedParties;
      },
      { petitioner: [], privatePractitioners: [], respondent: [] },
    );
  } else {
    parties = {
      petitioner: formattedCaseDetail.petitioners,
      privatePractitioners: formattedCaseDetail.privatePractitioners,
      respondent: formattedCaseDetail.irsPractitioners,
    };
  }

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

  let caseOrGroup = 'case';

  if (
    formattedCaseDetail.isLeadCase &&
    formattedCaseDetail.consolidatedCases.filter(c => c.checked).length > 1
  ) {
    caseOrGroup = 'group';
  }

  return {
    caseOrGroup,
    contactsNeedingPaperService,
    showPaperAlert: contactsNeedingPaperService.length > 0,
  };
};
