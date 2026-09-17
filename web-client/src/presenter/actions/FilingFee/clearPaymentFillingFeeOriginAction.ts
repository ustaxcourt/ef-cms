import { state } from '@web-client/presenter/app.cerebral';

export const clearPaymentFillingFeeOriginAction = ({
  store,
}: ActionProps): void => {
  store.set(state.paymentFillingFeeOrigin, null);
};
