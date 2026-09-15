import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';
import { setCasePaymentFillingFeeAction } from '@web-client/presenter/actions/setCasePaymentFillingFeeAction';
import { unsetCasePaymentFillingFeeAction } from '@web-client/presenter/actions/unsetCasePaymentFillingFeeAction';

export const initMyCasesFilingFeePaymentSequence = [
  clearErrorAlertsAction,
  setCasePaymentFillingFeeAction,
  setWaitingForResponseAction,
  initFilingFeePaymentAction,
  {
    success: [unsetCasePaymentFillingFeeAction],
    error: [unsetWaitingForResponseAction, unsetCasePaymentFillingFeeAction],
  },
];
