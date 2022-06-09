import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';
import { uniqBy } from 'lodash';

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
  const {
    CONTACT_TYPE_TITLES,
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
    ENTERED_AND_SERVED_EVENT_CODES,
    SERVICE_INDICATOR_TYPES,
  } = applicationContext.getConstants();

  const modalName = get(state.modal.showModal);

  const formattedCaseDetail = get(state.formattedCaseDetail);

  const form = get(state.form);

  const consolidatedCaseDuplicateDocketEntriesFlag = get(
    state.featureFlagHelper.consolidatedCaseDuplicateDocketEntries,
  );

  const eventCodesNotCompatibleWithConsolidation = [
    ...ENTERED_AND_SERVED_EVENT_CODES,
    ...COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  ];

  const hasConsolidatedCases =
    formattedCaseDetail.consolidatedCases &&
    formattedCaseDetail.consolidatedCases.length > 0;

  const isSavedAndServed = modalName === 'ConfirmInitiateServiceModal';

  const showConsolidatedCasesFlag =
    formattedCaseDetail.isLeadCase &&
    isSavedAndServed &&
    consolidatedCaseDuplicateDocketEntriesFlag &&
    !eventCodesNotCompatibleWithConsolidation.includes(form.eventCode) &&
    hasConsolidatedCases;

  let parties;
  if (showConsolidatedCasesFlag) {
    parties = formattedCaseDetail.consolidatedCases.reduce(
      (aggregatedParties, aCase) => {
        if (!aCase.checked) {
          return aggregatedParties;
        }
        aggregatedParties.petitioners = aggregatedParties.petitioners.concat(
          aCase.petitioners,
        );
        aggregatedParties.privatePractitioners =
          aggregatedParties.privatePractitioners.concat(
            aCase.privatePractitioners,
          );
        aggregatedParties.irsPractitioners =
          aggregatedParties.irsPractitioners.concat(aCase.irsPractitioners);

        return aggregatedParties;
      },
      { irsPractitioners: [], petitioners: [], privatePractitioners: [] },
    );
    parties.petitioners = uniqBy(parties.petitioners, 'contactId');
    parties.privatePractitioners = uniqBy(
      parties.privatePractitioners,
      'userId',
    );
    parties.irsPractitioners = uniqBy(parties.irsPractitioners, 'userId');
  } else {
    parties = {
      irsPractitioners: formattedCaseDetail.irsPractitioners,
      petitioners: formattedCaseDetail.petitioners,
      privatePractitioners: formattedCaseDetail.privatePractitioners,
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
    formattedCaseDetail.consolidatedCases.filter(c => c.checked).length > 1 &&
    showConsolidatedCasesFlag
  ) {
    caseOrGroup = 'group';
  }

  return {
    caseOrGroup,
    contactsNeedingPaperService,
    showConsolidatedCasesFlag,
    showPaperAlert: contactsNeedingPaperService.length > 0,
  };
};
