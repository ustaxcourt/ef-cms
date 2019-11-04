import { state } from 'cerebral';

export const caseDetailHelper = (get, applicationContext) => {
  const { Case } = applicationContext.getEntityConstructors();
  const USER_ROLES = get(state.constants.USER_ROLES);
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const caseHasRespondent =
    !!caseDetail && !!caseDetail.respondents && !!caseDetail.respondents.length;
  const userRole = get(state.user.role);
  const showActionRequired =
    !caseDetail.payGovId && userRole === USER_ROLES.petitioner;
  const documentDetailTab =
    get(state.caseDetailPage.informationTab) || 'docketRecord';
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = ['CaseDetail'].includes(currentPage);
  const caseIsPaid = caseDetail.payGovId && !form.paymentType;
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(userRole);
  const isRequestAccessForm = currentPage === 'RequestAccessWizard';
  const isJudge = 'judge' == userRole;
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

  let showFileDocumentButton = ['CaseDetail'].includes(currentPage);
  let showAddDocketEntryButton =
    ['CaseDetailInternal'].includes(currentPage) &&
    userRole === USER_ROLES.docketClerk;
  let showCreateOrderButton =
    ['CaseDetailInternal'].includes(currentPage) &&
    [
      USER_ROLES.docketClerk,
      USER_ROLES.judge,
      USER_ROLES.petitionsClerk,
      USER_ROLES.adc,
    ].includes(userRole);
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
      if (userRole === 'practitioner') {
        showRequestAccessToCaseButton =
          !pendingAssociation && !isRequestAccessForm;
        showPendingAccessToCaseButton = pendingAssociation;
      }
      if (userRole === 'respondent') {
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

  let showEditPrimaryContactButton = false;

  if (userRole === USER_ROLES.petitioner) {
    showEditPrimaryContactButton = true;
  } else if (userRole === USER_ROLES.respondent) {
    showEditPrimaryContactButton = false;
  } else if (userRole === USER_ROLES.practitioner) {
    showEditPrimaryContactButton = userAssociatedWithCase;
  }

  const showServeToIrsButton = ['New', 'Recalled'].includes(caseDetail.status);
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
    showAddCounsel: !isExternalUser,
    showAddDocketEntryButton,
    showCaptionEditButton:
      caseDetail.status !== 'Batched for IRS' && !isExternalUser,
    showCaseDeadlinesExternal,
    showCaseDeadlinesInternal,
    showCaseDeadlinesInternalEmpty,
    showCaseInformationPublic: isExternalUser,
    showCaseNameForPrimary,
    showCreateOrderButton,
    showDirectDownloadLink: directDocumentLinkDesired,
    showDocketRecordInProgressState: !isExternalUser,
    showDocumentDetailLink: !directDocumentLinkDesired,
    showDocumentStatus: !caseDetail.irsSendDate,
    showEditContactButton: isExternalUser,
    showEditPractitioners:
      !isExternalUser &&
      (caseDetail.practitioners && !!caseDetail.practitioners.length),
    showEditPrimaryContactButton,
    showEditRespondents:
      !isExternalUser &&
      (caseDetail.respondents && !!caseDetail.respondents.length),
    showEditSecondaryContactModal:
      get(state.showModal) === 'EditSecondaryContact',
    showFileDocumentButton,
    showFileFirstDocumentButton,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showNotes: isJudge,
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
    showServeToIrsButton,
    userHasAccessToCase,
  };
};
