import { state } from 'cerebral';

export const caseDetailHelper = get => {
  const caseDetail = get(state.caseDetail);
  const caseHasRespondent = !!caseDetail && !!caseDetail.respondent;
  const userRole = get(state.user.role);
  const showActionRequired = !caseDetail.payGovId && userRole === 'petitioner';
  const documentDetailTab = get(state.documentDetail.tab) || 'docketRecord';
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = ['CaseDetail'].includes(currentPage);
  const caseIsPaid = caseDetail.payGovId && !form.paymentType;
  const isExternalUser = ['practitioner', 'petitioner', 'respondent'].includes(
    userRole,
  );

  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);
  const pendingAssociation = get(state.screenMetadata.pendingAssociation);

  let showFileDocumentButton = ['CaseDetail'].includes(currentPage);
  let showAddDocketEntryButton =
    ['CaseDetailInternal'].includes(currentPage) && userRole === 'docketclerk';
  let showCreateOrderButton =
    ['CaseDetailInternal'].includes(currentPage) &&
    userRole === 'petitionsclerk';
  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;
  let userHasAccessToCase = false;

  if (isExternalUser) {
    if (userAssociatedWithCase) {
      userHasAccessToCase = true;
      showFileDocumentButton = true;
      showRequestAccessToCaseButton = false;
      showPendingAccessToCaseButton = false;
      showFileFirstDocumentButton = false;
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
  }

  return {
    documentDetailTab,
    showActionRequired,
    showAddDocketEntryButton,
    showCaptionEditButton:
      caseDetail.status !== 'Batched for IRS' && !isExternalUser,
    showCaseInformationPublic: isExternalUser,
    showCreateOrderButton,
    showDirectDownloadLink: directDocumentLinkDesired,
    showDocumentDetailLink: !directDocumentLinkDesired,
    showDocumentStatus: !caseDetail.irsSendDate,
    showFileDocumentButton,
    showFileFirstDocumentButton,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !caseIsPaid,
    showPaymentRecord: caseIsPaid,
    showPendingAccessToCaseButton,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showRequestAccessToCaseButton,
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
    userHasAccessToCase,
  };
};
