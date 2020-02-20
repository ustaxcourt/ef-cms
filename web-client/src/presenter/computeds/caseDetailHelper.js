import { isEmpty } from 'lodash';
import { state } from 'cerebral';

export const caseDetailHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { Case } = applicationContext.getEntityConstructors();
  const { PARTY_TYPES, USER_ROLES } = applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const documentDetailTab =
    get(state.caseDetailPage.primaryTab) || 'docketRecord';
  const currentPage = get(state.currentPage);
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const modalState = get(state.modal);
  let showEditPetitionerInformation = false;
  const {
    noticeOfAttachments,
    orderDesignatingPlaceOfTrial,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToShowCause,
  } = caseDetail;
  const permissions = get(state.permissions);
  const showJudgesNotes = permissions.TRIAL_SESSION_WORKING_COPY;

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

  const showCaseNameForPrimary = ![
    PARTY_TYPES.petitioner,
    PARTY_TYPES.petitionerDeceasedSpouse,
  ].includes(caseDetail.partyType);

  let showEditContacts = false;

  if (user.role === USER_ROLES.petitioner) {
    showEditContacts = true;
  } else if (user.role === USER_ROLES.respondent) {
    showEditContacts = false;
  } else if (user.role === USER_ROLES.practitioner) {
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
      if (caseDetail.practitioners) {
        practitioner.isAlreadyInCase = caseDetail.practitioners.find(
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
      if (caseDetail.respondents) {
        respondent.isAlreadyInCase = caseDetail.respondents.find(
          caseRespondent => caseRespondent.userId === respondent.userId,
        );
      }
    });
  }

  const hasOrders = [
    noticeOfAttachments,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToShowCause,
    orderDesignatingPlaceOfTrial,
  ].some(hasOrder => !!hasOrder);

  const hasConsolidatedCases = !isEmpty(caseDetail.consolidatedCases);

  return {
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
    caseDeadlines,
    documentDetailTab,
    hasConsolidatedCases,
    hasOrders,
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
    showCaseDeadlinesExternal,
    showCaseDeadlinesInternal,
    showCaseDeadlinesInternalEmpty,
    showCaseInformationExternal: isExternalUser,
    showCaseNameForPrimary,
    showDocketRecordInProgressState: !isExternalUser,
    showDocumentStatus: !caseDetail.irsSendDate,
    showEditContacts,
    showEditPetitionDetailsButton: permissions.EDIT_PETITION_DETAILS,
    showEditPetitionerInformation,
    showEditSecondaryContactModal:
      get(state.showModal) === 'EditSecondaryContact',
    showFileDocumentButton,
    showFilingFeeExternal:
      isExternalUser && user.role !== USER_ROLES.respondent,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showJudgesNotes,
    showPractitionerSection:
      !isExternalUser ||
      (caseDetail.practitioners && !!caseDetail.practitioners.length),
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showQcWorkItemsUntouchedState,
    showRespondentSection:
      !isExternalUser ||
      (caseDetail.respondents && !!caseDetail.respondents.length),
    userCanViewCase:
      (isExternalUser && userAssociatedWithCase) || !caseDetail.isSealed,
    userHasAccessToCase,
  };
};
