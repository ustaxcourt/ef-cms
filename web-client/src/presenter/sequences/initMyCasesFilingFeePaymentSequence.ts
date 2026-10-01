import { clearErrorAlertsAction } from '@web-client/presenter/actions/clearErrorAlertsAction';
import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';
import { setCasePaymentFilingFeeAction } from '@web-client/presenter/actions/setCasePaymentFilingFeeAction';
import { unsetCasePaymentFilingFeeAction } from '@web-client/presenter/actions/unsetCasePaymentFilingFeeAction';

export const initMyCasesFilingFeePaymentSequence = [
  clearErrorAlertsAction,
  setCasePaymentFilingFeeAction,
  setWaitingForResponseAction,
  initFilingFeePaymentAction,
  {
    error: [
      setAlertErrorAction,
      unsetWaitingForResponseAction,
      unsetCasePaymentFilingFeeAction,
    ],
    success: [],
  },
  unsetCasePaymentFilingFeeAction,
];
