import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const caseDetailHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { USER_ROLES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const documentDetailTab =
    get(state.currentViewMetadata.caseDetail.primaryTab) || 'docketRecord';
  const currentPage = get(state.currentPage);
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const modalState = get(state.modal);
  let showEditPetitionerInformation = false;
  const permissions = get(state.permissions);
  const showJudgesNotes = permissions.JUDGES_NOTES;

  let showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT && ['CaseDetail'].includes(currentPage);

  let showCaseDeadlinesExternal = false;
  let showCaseDeadlinesInternal = false;
  let showCaseDeadlinesInternalEmpty = false;
  let userHasAccessToCase = false;
  let showQcWorkItemsUntouchedState = false;

  if (isExternalUser) {
    if (userAssociatedWithCase) {
      userHasAccessToCase = true;
      showFileDocumentButton = true;

      if (caseDeadlines && caseDeadlines.length > 0) {
        showCaseDeadlinesExternal = true;
      }
    } else {
      showFileDocumentButton = false;
    }
  } else {
    userHasAccessToCase = true;
    showQcWorkItemsUntouchedState = true;

    if (caseDeadlines && caseDeadlines.length > 0) {
      showCaseDeadlinesInternal = true;
    } else {
      showCaseDeadlinesInternalEmpty = true;
    }
  }

  let showEditContacts = false;

  if (user.role === USER_ROLES.petitioner) {
    showEditContacts = true;
  } else if (user.role === USER_ROLES.irsPractitioner) {
    showEditContacts = false;
  } else if (user.role === USER_ROLES.privatePractitioner) {
    showEditContacts = userAssociatedWithCase;
  } else if (user.role === USER_ROLES.docketClerk) {
    showEditPetitionerInformation = true;
  }

  const practitionerMatchesFormatted =
    modalState && modalState.practitionerMatches;
  if (practitionerMatchesFormatted) {
    practitionerMatchesFormatted.map(practitioner => {
      if (practitioner.contact) {
        practitioner.cityStateZip = `${practitioner.contact.city}, ${practitioner.contact.state} ${practitioner.contact.postalCode}`;
      }
      if (caseDetail.privatePractitioners) {
        practitioner.isAlreadyInCase = caseDetail.privatePractitioners.find(
          casePractitioner => casePractitioner.userId === practitioner.userId,
        );
      }
    });
  }
  const respondentMatchesFormatted = modalState && modalState.respondentMatches;
  if (respondentMatchesFormatted) {
    respondentMatchesFormatted.map(respondent => {
      if (respondent.contact) {
        respondent.cityStateZip = `${respondent.contact.city}, ${respondent.contact.state} ${respondent.contact.postalCode}`;
      }
      if (caseDetail.irsPractitioners) {
        respondent.isAlreadyInCase = caseDetail.irsPractitioners.find(
          caseRespondent => caseRespondent.userId === respondent.userId,
        );
      }
    });
  }

  const hasConsolidatedCases = !isEmpty(caseDetail.consolidatedCases);

  const petitionDocument = applicationContext
    .getUtilities()
    .getPetitionDocumentFromDocuments(caseDetail.documents);
  const petitionIsServed = petitionDocument && !!petitionDocument.servedAt;

  return {
    caseDeadlines,
    documentDetailTab,
    hasConsolidatedCases,
    practitionerMatchesFormatted,
    practitionerSearchResultsCount:
      modalState &&
      modalState.practitionerMatches &&
      modalState.practitionerMatches.length,
    respondentMatchesFormatted,
    respondentSearchResultsCount:
      modalState &&
      modalState.respondentMatches &&
      modalState.respondentMatches.length,
    showAddCorrespondenceButton: permissions.CASE_CORRESPONDENCE,
    showCaseDeadlinesExternal,
    showCaseDeadlinesInternal,
    showCaseDeadlinesInternalEmpty,
    showCaseInformationExternal: isExternalUser,
    showDocketRecordInProgressState: !isExternalUser,
    showEditContacts,
    showEditPetitionDetailsButton: permissions.EDIT_PETITION_DETAILS,
    showEditPetitionerInformation,
    showEditSecondaryContactModal:
      get(state.modal.showModal) === 'EditSecondaryContact',
    showFileDocumentButton,
    showFilingFeeExternal:
      isExternalUser &&
      user.role !== USER_ROLES.irsPractitioner &&
      user.role !== USER_ROLES.irsSuperuser,
    showJudgesNotes,
    showPetitionProcessingAlert: isExternalUser && !petitionIsServed,
    showPractitionerSection:
      !isExternalUser ||
      (caseDetail.privatePractitioners &&
        !!caseDetail.privatePractitioners.length),
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showQcWorkItemsUntouchedState,
    showRespondentSection:
      !isExternalUser ||
      (caseDetail.irsPractitioners && !!caseDetail.irsPractitioners.length),
    userCanViewCase:
      (isExternalUser && userAssociatedWithCase) || !caseDetail.isSealed,
    userHasAccessToCase,
  };
};
