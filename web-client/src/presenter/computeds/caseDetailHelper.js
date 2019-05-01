import { some } from 'lodash';
import { state } from 'cerebral';

export const caseDetailHelper = get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = ['CaseDetail'].includes(currentPage);
  const userRole = get(state.user.role);
  const userId = get(state.user.userId);

  let showFileDocumentButton = ['CaseDetail'].includes(currentPage);
  let showRequestAccessToCaseButton = false;
  if (userRole === 'practitioner') {
    showFileDocumentButton = false;
    showRequestAccessToCaseButton = true;
    if (
      caseDetail &&
      caseDetail.practitioners &&
      some(caseDetail.practitioners, { userId: userId })
    ) {
      showFileDocumentButton = true;
      showRequestAccessToCaseButton = false;
    }
  }

  let userHasAccessToCase = true;
  if (userRole === 'practitioner') {
    userHasAccessToCase = false;
    if (
      caseDetail &&
      caseDetail.practitioners &&
      some(caseDetail.practitioners, { userId: userId })
    ) {
      userHasAccessToCase = true;
    }
  }

  return {
    showActionRequired: !caseDetail.payGovId && userRole === 'petitioner',
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
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !(caseDetail.payGovId && !form.paymentType),
    showPaymentRecord: caseDetail.payGovId && !form.paymentType,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showRequestAccessToCaseButton,
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
    userHasAccessToCase,
  };
};
