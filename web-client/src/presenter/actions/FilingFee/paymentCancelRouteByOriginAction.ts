import {
  PAYMENT_FILING_FEE_ORIGIN,
  type PaymentFilingFeeOrigin,
} from '@shared/business/entities/EntityConstants';
export const paymentCancelRouteByOriginAction = ({
  path,
  props,
}: ActionProps<{ origin?: PaymentFilingFeeOrigin }>) => {
  if (props.origin === PAYMENT_FILING_FEE_ORIGIN.DASHBOARD) {
    return path.dashboard();
  }

  return path.petition();
};
