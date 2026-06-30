import { processFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/processFilingFeePaymentAction';
import { setAlertErrorAction } from '@web-client/presenter/actions/setAlertErrorAction';
import { gotoDashboardSequence } from '@web-client/presenter/sequences/gotoDashboardSequence';

export const paymentSuccessSequence = [
  // Set alert on dashboard based off of result
  processFilingFeePaymentAction, // Add error handling
  gotoDashboardSequence,
  setAlertErrorAction,
];
