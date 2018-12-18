import { state } from 'cerebral';

export default get => {
  const caseDetail = get(state.caseDetail);
  const form = get(state.form);

  return {
    showDocumentStatus: !caseDetail.irsSendDate,
    showIrsServedDate: !!caseDetail.irsSendDate,
    showPayGovIdInput: form.paymentType == 'payGov',
    showPaymentOptions: !(caseDetail.payGovId && !form.paymentType),
    showActionRequired: !caseDetail.payGovId,
    showPaymentRecord: caseDetail.payGovId && !form.paymentType,
  };
};
