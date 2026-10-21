import { state } from '@web-client/presenter/app.cerebral';

export const clearPaymentFilingFeeOriginAction = ({
  store,
}: ActionProps): void => {
  store.set(state.paymentFilingFeeOrigin, null);
};
