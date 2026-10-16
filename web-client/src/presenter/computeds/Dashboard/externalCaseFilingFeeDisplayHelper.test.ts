import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';
import { shouldShowMyCasesPayFilingFeeButton } from './externalCaseFilingFeeDisplayHelper';

describe('shouldShowMyCasesPayFilingFeeButton', () => {
  it('returns false when the payment portal feature flag is off', () => {
    expect(
      shouldShowMyCasesPayFilingFeeButton({
        enablePaymentPortalIntegration: false,
        isRequestingUserAssociated: true,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      }),
    ).toBe(false);
  });

  it('returns false when the filing fee is not unpaid', () => {
    expect(
      shouldShowMyCasesPayFilingFeeButton({
        enablePaymentPortalIntegration: true,
        isRequestingUserAssociated: true,
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      }),
    ).toBe(false);
  });

  it('returns false when the user is not associated with the case', () => {
    expect(
      shouldShowMyCasesPayFilingFeeButton({
        enablePaymentPortalIntegration: true,
        isRequestingUserAssociated: false,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      }),
    ).toBe(false);
  });

  it('returns true when the portal is enabled, the fee is unpaid, and the user is associated', () => {
    expect(
      shouldShowMyCasesPayFilingFeeButton({
        enablePaymentPortalIntegration: true,
        isRequestingUserAssociated: true,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      }),
    ).toBe(true);
  });
});
