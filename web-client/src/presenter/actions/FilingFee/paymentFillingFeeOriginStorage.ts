export const PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY = 'paymentFillingFeeOrigin';

export const PAYMENT_FILLING_FEE_ORIGIN = {
  DASHBOARD: 'dashboard',
} as const;

export type PaymentFillingFeeOrigin =
  (typeof PAYMENT_FILLING_FEE_ORIGIN)[keyof typeof PAYMENT_FILLING_FEE_ORIGIN];

export const persistPaymentFillingFeeOrigin = (
  origin: PaymentFillingFeeOrigin,
): void => {
  window.sessionStorage.setItem(PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY, origin);
};

export const readPaymentFillingFeeOriginFromStorage =
  (): PaymentFillingFeeOrigin | null => {
    const origin = window.sessionStorage.getItem(
      PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY,
    );

    if (origin === PAYMENT_FILLING_FEE_ORIGIN.DASHBOARD) {
      return origin;
    }

    return null;
  };

export const clearPaymentFillingFeeOriginFromStorage = (): void => {
  window.sessionStorage.removeItem(PAYMENT_FILLING_FEE_ORIGIN_STORAGE_KEY);
};
