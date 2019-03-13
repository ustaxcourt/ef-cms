import { state } from 'cerebral';

export default get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);
  const currentPage = get(state.currentPage);
  const directDocumentLinkDesired = [
    'CaseDetailPetitioner',
    'CaseDetailRespondent',
  ].includes(currentPage);

  return {
    showActionRequired: !caseDetail.payGovId,
    showCaptionEditButton: caseDetail.status !== 'Batched for IRS',
    showDirectDownloadLink: directDocumentLinkDesired,
    showDocumentDetailLink: !directDocumentLinkDesired,
    showDocumentStatus: !caseDetail.irsSendDate,
    showFileDocumentButton: ['CaseDetailRespondent'].includes(currentPage),
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !(caseDetail.payGovId && !form.paymentType),
    showPaymentRecord: caseDetail.payGovId && !form.paymentType,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
  };
};
