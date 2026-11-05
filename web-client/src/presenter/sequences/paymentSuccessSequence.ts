import { processFilingFeePaymentAction } from '@web-client/presenter/actions/FilingFee/processFilingFeePaymentAction';
import { setFilingFeeReturnPageAction } from '@web-client/presenter/actions/FilingFee/setFilingFeeReturnPageAction';
import { setProcessPaymentStatusAction } from '@web-client/presenter/actions/FilingFee/setProcessPaymentStatusAction';
import { navigateToPathAction } from '@web-client/presenter/actions/navigateToPathAction';
import { setupCurrentPageAction } from '@web-client/presenter/actions/setupCurrentPageAction';

export const paymentSuccessSequence = [
  setupCurrentPageAction('Interstitial'),
  processFilingFeePaymentAction,
  setProcessPaymentStatusAction,
  setFilingFeeReturnPageAction,
  navigateToPathAction,
];
