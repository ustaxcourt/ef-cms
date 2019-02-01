import { state } from 'cerebral';

export default get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  return {
    canServeToIRS: ['General', 'New'].includes(caseDetail.status), // TODO: move to detail helper
    showDocumentStatus: !caseDetail.irsSendDate,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !(caseDetail.payGovId && !form.paymentType),
    showActionRequired: !caseDetail.payGovId,
    showPaymentRecord: caseDetail.payGovId && !form.paymentType,
    showPreferredTrialCity: caseDetail.preferredTrialCity,
  };
};
