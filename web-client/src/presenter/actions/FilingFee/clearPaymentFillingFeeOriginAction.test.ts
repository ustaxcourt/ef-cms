import { clearPaymentFillingFeeOriginAction } from '@web-client/presenter/actions/FilingFee/clearPaymentFillingFeeOriginAction';
import {
  PAYMENT_FILLING_FEE_ORIGIN,
  PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY,
  persistPaymentFillingFeeOrigin,
} from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOriginStorage';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearPaymentFillingFeeOriginAction', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should clear the payment origin from session storage', async () => {
    persistPaymentFillingFeeOrigin(PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD);

    await runAction(clearPaymentFillingFeeOriginAction, {
      modules: { presenter },
    });

    expect(
      window.sessionStorage.getItem(PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY),
    ).toBeNull();
  });
});
