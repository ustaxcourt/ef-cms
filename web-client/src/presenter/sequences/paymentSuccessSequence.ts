import { processFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/processFilingFeePaymentAction';
import { gotoDashboardSequence } from '@web-client/presenter/sequences/gotoDashboardSequence';

export const paymentSuccessSequence = [
  processFilingFeePaymentAction, // Add error handling
  // Set alert on dashboard based off of result
  gotoDashboardSequence,
];
