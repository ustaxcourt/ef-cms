import { processFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/processFilingFeePaymentAction';
import { setProcessPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/setProcessPaymentStatusAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';

export const paymentSuccessSequence = [
  processFilingFeePaymentAction,
  {
    success: [setProcessPaymentStatusAction],
    error: [setAlertErrorAction],
  },
  navigateToPathAction,
];
