import { clearPaymentFillingFeeOriginFromStorage } from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOriginStorage';

export const clearPaymentFillingFeeOriginAction = (): void => {
  clearPaymentFillingFeeOriginFromStorage();
};
