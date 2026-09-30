import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const initFilingFeePaymentSequence = [
  clearErrorAlertsAction,
  setWaitingForResponseAction,
  initFilingFeePaymentAction,
  {
    error: [setAlertErrorAction, unsetWaitingForResponseAction],
    success: [],
  },
  unsetWaitingForResponseAction,
];
