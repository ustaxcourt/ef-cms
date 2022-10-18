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
    NON_MULTI_DOCKETABLE_EVENT_CODES,
    SERVICE_INDICATOR_TYPES,
    USER_ROLES,
  } = applicationContext.getConstants();

  const modalName = get(state.modal.showModal);

  const showConsolidatedOptions = [
    'ConfirmInitiateServiceModal',
    'ConfirmInitiateCourtIssuedDocumentServiceModal',
    'ConfirmInitiatePaperDocumentServiceModal',
  ].includes(modalName);

  const formattedCaseDetail = get(state.formattedCaseDetail);

  const form = get(state.form);

  const consolidatedCasesPropagateDocketEntriesFlag = get(
    state.featureFlagHelper.consolidatedCasesPropagateDocketEntries,
  );

  const hasConsolidatedCases =
    formattedCaseDetail.consolidatedCases &&
    formattedCaseDetail.consolidatedCases.length > 0;

  const docketEntryId = get(state.docketEntryId);

  let { eventCode } = form;

  if (!eventCode) {
    ({ eventCode } = formattedCaseDetail.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    ));
  }

  // this is temporary until the flow for 9616 is implemented (QC workflow)
  const editingDocketEntry = !!get(state.isEditingDocketEntry);

  const showConsolidatedCasesForService =
    !editingDocketEntry &&
    formattedCaseDetail.isLeadCase &&
    showConsolidatedOptions &&
    consolidatedCasesPropagateDocketEntriesFlag &&
    !NON_MULTI_DOCKETABLE_EVENT_CODES.includes(eventCode) &&
    hasConsolidatedCases;

  const confirmationText = showConsolidatedCasesForService
    ? 'The following document will be served on all parties in selected cases:'
    : 'The following document will be served on all parties:';

  let parties;
  if (showConsolidatedCasesForService) {
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
    if (party.role === USER_ROLES.privatePractitioner) {
      return 'Petitioner Counsel';
    } else if (party.role === USER_ROLES.irsPractitioner) {
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
    showConsolidatedCasesForService
  ) {
    caseOrGroup = 'group';
  }

  return {
    caseOrGroup,
    confirmationText,
    contactsNeedingPaperService,
    showConsolidatedCasesForService,
    showPaperAlert: contactsNeedingPaperService.length > 0,
  };
};
