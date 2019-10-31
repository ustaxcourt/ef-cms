import { state } from 'cerebral';

export const caseDetailHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const { Case } = applicationContext.getEntityConstructors();
  const USER_ROLES = get(state.constants.USER_ROLES);
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const caseHasRespondent =
    !!caseDetail && !!caseDetail.respondents && !!caseDetail.respondents.length;
  const showActionRequired =
    !caseDetail.payGovId && user.role === USER_ROLES.petitioner;
  const documentDetailTab =
    get(state.caseDetailPage.informationTab) || 'docketRecord';
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const caseIsPaid = caseDetail.payGovId && !form.paymentType;
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);
  const isRequestAccessForm = currentPage === 'RequestAccessWizard';
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const pendingAssociation = get(state.screenMetadata.pendingAssociation);
  const modalState = get(state.modal);
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

  const showAddDocketEntryButton =
    permissions.DOCKET_ENTRY && ['CaseDetailInternal'].includes(currentPage);
  const showCreateOrderButton =
    permissions.COURT_ISSUED_DOCUMENT &&
    ['CaseDetailInternal'].includes(currentPage);
  const showCaseNotes = permissions.TRIAL_SESSION_WORKING_COPY;

  let showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT && ['CaseDetail'].includes(currentPage);

  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;
  let showCaseDeadlinesExternal = false;
  let showCaseDeadlinesInternal = false;
  let showCaseDeadlinesInternalEmpty = false;
  let userHasAccessToCase = false;

  if (isExternalUser) {
    if (userAssociatedWithCase) {
      userHasAccessToCase = true;
      showFileDocumentButton = true;
      showRequestAccessToCaseButton = false;
      showPendingAccessToCaseButton = false;
      showFileFirstDocumentButton = false;

      if (caseDeadlines && caseDeadlines.length > 0) {
        showCaseDeadlinesExternal = true;
      }
    } else {
      showFileDocumentButton = false;
      if (user.role === USER_ROLES.practitioner) {
        showRequestAccessToCaseButton =
          !pendingAssociation && !isRequestAccessForm;
        showPendingAccessToCaseButton = pendingAssociation;
      }
      if (user.role === USER_ROLES.respondent) {
        showFileFirstDocumentButton = !caseHasRespondent;
        showRequestAccessToCaseButton =
          caseHasRespondent && !isRequestAccessForm;
      }
    }
  } else {
    userHasAccessToCase = true;

    if (caseDeadlines && caseDeadlines.length > 0) {
      showCaseDeadlinesInternal = true;
    } else {
      showCaseDeadlinesInternalEmpty = true;
    }
  }

  const showCaseNameForPrimary = !get(state.caseDetail.contactSecondary.name);

  let showEditContacts = false;

  if (user.role === USER_ROLES.petitioner) {
    showEditContacts = true;
  } else if (user.role === USER_ROLES.respondent) {
    showEditContacts = false;
  } else if (user.role === USER_ROLES.practitioner) {
    showEditContacts = userAssociatedWithCase;
  }

  const showRecallButton = caseDetail.status === 'Batched for IRS';

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

  return {
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
    caseDeadlines,
    documentDetailTab,
    hasOrders,
    hidePublicCaseInformation: !isExternalUser,
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
    showActionRequired,
    showAddDocketEntryButton,
    showCaptionEditButton:
      caseDetail.status !== 'Batched for IRS' && !isExternalUser,
    showCaseDeadlinesExternal,
    showCaseDeadlinesInternal,
    showCaseDeadlinesInternalEmpty,
    showCaseInformationPublic: isExternalUser,
    showCaseNameForPrimary,
    showCaseNotes,
    showCreateOrderButton,
    showDocketRecordInProgressState: !isExternalUser,
    showDocumentStatus: !caseDetail.irsSendDate,
    showEditContacts,
    showEditSecondaryContactModal:
      get(state.showModal) === 'EditSecondaryContact',
    showFileDocumentButton,
    showFileFirstDocumentButton,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !caseIsPaid,
    showPaymentRecord: caseIsPaid,
    showPendingAccessToCaseButton,
    showPractitionerSection:
      !isExternalUser ||
      (caseDetail.practitioners && !!caseDetail.practitioners.length),
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showRecallButton,
    showRequestAccessToCaseButton,
    showRespondentSection:
      !isExternalUser ||
      (caseDetail.respondents && !!caseDetail.respondents.length),
    userHasAccessToCase,
  };
};
