import { state } from '@web-client/presenter/app.cerebral';

export const setProcessPaymentStatusAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.processPaymentStatus, props.processPaymentStatus);
};
