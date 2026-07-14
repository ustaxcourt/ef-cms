import { initFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/initFilingFeePaymentAction';
import { setWaitingForResponseAction } from '@web-client/presenter/actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const initFilingFeePaymentSequence = [
  setWaitingForResponseAction,
  initFilingFeePaymentAction,
  unsetWaitingForResponseAction,
];
