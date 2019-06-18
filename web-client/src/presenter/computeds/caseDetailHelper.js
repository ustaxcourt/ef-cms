import { state } from 'cerebral';

export const caseDetailHelper = get => {
  const caseDetail = get(state.caseDetail);
  const userRole = get(state.user.role);
  const showActionRequired = !caseDetail.payGovId && userRole === 'petitioner';
  const documentDetailTab = get(state.documentDetail.tab) || 'docketRecord';
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = ['CaseDetail'].includes(currentPage);
  const userId = get(state.user.userId);

  const isAssociated = get(state.screenMetadata.isAssociated);
  const pendingAssociation = get(state.screenMetadata.pendingAssociation);
  const notAssociated = get(state.screenMetadata.notAssociated);

  let showFileDocumentButton = ['CaseDetail'].includes(currentPage);
  let showAddDocketEntryButton =
    ['CaseDetailInternal'].includes(currentPage) && userRole === 'docketclerk';
  let showRequestAccessToCaseButton = false;
  let showPendingAccessToCaseButton = false;
  let showFileFirstDocumentButton = false;
  let userHasAccessToCase = true;

  if (userRole === 'practitioner') {
    if (notAssociated) {
      userHasAccessToCase = false;
      showFileDocumentButton = false;
      showRequestAccessToCaseButton = true;
      showPendingAccessToCaseButton = false;
    } else if (isAssociated) {
      showFileDocumentButton = true;
      showRequestAccessToCaseButton = false;
      showPendingAccessToCaseButton = false;
    } else if (pendingAssociation) {
      userHasAccessToCase = false;
      showFileDocumentButton = false;
      showRequestAccessToCaseButton = false;
      showPendingAccessToCaseButton = true;
    }
  }

  if (userRole === 'respondent') {
    const caseHasRespondent = !!caseDetail && !!caseDetail.respondent;
    if (caseHasRespondent && caseDetail.respondent.userId === userId) {
      showFileDocumentButton = true;
      showFileFirstDocumentButton = false;
      showRequestAccessToCaseButton = false;
    } else if (caseHasRespondent && caseDetail.respondent.userId !== userId) {
      userHasAccessToCase = false;
      showFileDocumentButton = false;
      showFileFirstDocumentButton = false;
      showRequestAccessToCaseButton = true;
    } else {
      userHasAccessToCase = false;
      showFileDocumentButton = false;
      showFileFirstDocumentButton = true;
      showRequestAccessToCaseButton = false;
    }
  }

  return {
    documentDetailTab,
    showActionRequired,
    showAddDocketEntryButton,
    showCaptionEditButton:
      caseDetail.status !== 'Batched for IRS' &&
      userRole !== 'petitioner' &&
      userRole !== 'practitioner' &&
      userRole !== 'respondent',
    showCaseInformationPublic:
      userRole === 'petitioner' || userRole === 'practitioner',
    showDirectDownloadLink: directDocumentLinkDesired,
    showDocumentDetailLink: !directDocumentLinkDesired,
    showDocumentStatus: !caseDetail.irsSendDate,
    showFileDocumentButton,
    showFileFirstDocumentButton,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !(caseDetail.payGovId && !form.paymentType),
    showPaymentRecord: caseDetail.payGovId && !form.paymentType,
    showPendingAccessToCaseButton,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showRequestAccessToCaseButton,
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
    userHasAccessToCase,
  };
};
