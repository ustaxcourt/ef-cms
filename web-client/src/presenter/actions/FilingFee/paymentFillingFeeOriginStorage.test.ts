import {
  PAYMENT_FILLING_FEE_ORIGIN,
  PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY,
  clearPaymentFillingFeeOriginFromStorage,
  persistPaymentFillingFeeOrigin,
  readPaymentFillingFeeOriginFromStorage,
} from '@web-client/presenter/actions/FilingFee/paymentFillingFeeOriginStorage';

describe('paymentFillingFeeOriginStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('should persist and read the dashboard origin', () => {
    persistPaymentFillingFeeOrigin(PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD);

    expect(
      window.sessionStorage.getItem(PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY),
    ).toEqual(PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD);
    expect(readPaymentFillingFeeOriginFromStorage()).toEqual(
      PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD,
    );
  });

  it('should return null for unknown stored values', () => {
    window.sessionStorage.setItem(
      PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY,
      'unknown',
    );

    expect(readPaymentFillingFeeOriginFromStorage()).toBeNull();
  });

  it('should clear the stored origin', () => {
    persistPaymentFillingFeeOrigin(PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD);

    clearPaymentFillingFeeOriginFromStorage();

    expect(readPaymentFillingFeeOriginFromStorage()).toBeNull();
  });
});
