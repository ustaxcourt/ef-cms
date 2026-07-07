import { processFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/processFilingFeePaymentAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';

export const paymentSuccessSequence = [
  processFilingFeePaymentAction, // Add error handling
  navigateToPathAction,
];
