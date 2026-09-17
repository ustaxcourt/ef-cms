export const PAYMENT_FILLING_FEE_ORIGIN = {
  DASHBOARD: 'dashboard',
} as const;

export type PaymentFillingFeeOrigin =
  (typeof PAYMENT_FILLING_FEE_ORIGIN)[keyof typeof PAYMENT_FILLING_FEE_ORIGIN];
