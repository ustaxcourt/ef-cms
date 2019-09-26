import { state } from 'cerebral';

export const caseDetailHelper = (get, applicationContext) => {
  const { Case } = applicationContext.getEntityConstructors();
  const caseDetail = get(state.caseDetail);
  const caseDeadlines = get(state.caseDeadlines) || [];
  const caseHasRespondent =
    !!caseDetail && !!caseDetail.respondents && !!caseDetail.respondents.length;
  const userRole = get(state.user.role);
  const showActionRequired = !caseDetail.payGovId && userRole === 'petitioner';
  const documentDetailTab =
    get(state.caseDetailPage.informationTab) || 'docketRecord';
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = ['CaseDetail'].includes(currentPage);
  const caseIsPaid = caseDetail.payGovId && !form.paymentType;
  const isExternalUser = ['practitioner', 'petitioner', 'respondent'].includes(
    userRole,
  );
  const isJudge = 'judge' == userRole;
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const pendingAssociation = get(state.screenMetadata.pendingAssociation);
  const modalState = get(state.modal);
  const {
    noticeOfAttachments,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToChangeDesignatedPlaceOfTrial,
    orderToShowCause,
  } = caseDetail;

  let showFileDocumentButton = ['CaseDetail'].includes(currentPage);
  let showAddDocketEntryButton =
    ['CaseDetailInternal'].includes(currentPage) && userRole === 'docketclerk';
  let showCreateOrderButton =
    ['CaseDetailInternal'].includes(currentPage) &&
    ['docketclerk', 'judge', 'petitionsclerk', 'seniorattorney'].includes(
      userRole,
    );
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
        showRequestAccessToCaseButton = !pendingAssociation;
        showPendingAccessToCaseButton = pendingAssociation;
      }
      if (userRole === 'respondent') {
        showFileFirstDocumentButton = !caseHasRespondent;
        showRequestAccessToCaseButton = caseHasRespondent;
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

  if (userRole === 'petitioner') {
    showEditPrimaryContactButton = true;
  } else if (userRole === 'respondent') {
    showEditPrimaryContactButton = false;
  } else if (userRole === 'practitioner') {
    showEditPrimaryContactButton = userAssociatedWithCase;
  }

  const showServeToIrsButton = ['New', 'Recalled'].includes(caseDetail.status);
  const showRecallButton = caseDetail.status === 'Batched for IRS';

  const hasOrders = [
    noticeOfAttachments,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
    orderForOds,
    orderForRatification,
    orderToShowCause,
    orderToChangeDesignatedPlaceOfTrial,
  ].some(hasOrder => !!hasOrder);

  return {
    caseCaptionPostfix: Case.CASE_CAPTION_POSTFIX,
    caseDeadlines,
    documentDetailTab,
    hasOrders,
    hidePublicCaseInformation: !isExternalUser,
    practitionerSearchResultsCount:
      modalState &&
      modalState.practitionerMatches &&
      modalState.practitionerMatches.length,
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
    showEditPrimaryContactButton,
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
