import { PAYMENT_STATUS } from '@shared/business/entities/EntityConstants';

export const shouldShowMyCasesPayFilingFeeButton = ({
  enablePaymentPortalIntegration,
  isRequestingUserAssociated,
  petitionPaymentStatus,
}: {
  enablePaymentPortalIntegration: boolean;
  isRequestingUserAssociated: boolean;
  petitionPaymentStatus: string;
}): boolean => {
  return (
    enablePaymentPortalIntegration &&
    petitionPaymentStatus === PAYMENT_STATUS.UNPAID &&
    isRequestingUserAssociated
  );
};
