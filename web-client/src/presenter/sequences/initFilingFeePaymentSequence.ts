import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const initFilingFeePaymentSequence = [
  clearErrorAlertsAction,
  setWaitingForResponseAction,
  initFilingFeePaymentAction,
  {
    success: [],
    error: [unsetWaitingForResponseAction],
  },
];
