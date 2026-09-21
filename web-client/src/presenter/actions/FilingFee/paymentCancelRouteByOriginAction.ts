import {
  PAYMENT_FILING_FEE_ORIGIN,
  type PaymentFilingFeeOrigin,
} from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const paymentCancelRouteByOriginAction = ({
  path,
  props,
  store,
}: ActionProps<{ origin?: PaymentFilingFeeOrigin }>) => {
  if (props.origin === PAYMENT_FILING_FEE_ORIGIN.DASHBOARD) {
    window.history.replaceState({}, '', '/');
    store.set(state.currentPage, 'DashboardExternalUser');
    return path.dashboard();
  }

  return path.petition();
};
