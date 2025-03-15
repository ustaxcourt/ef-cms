import { state } from '@web-client/presenter/app.cerebral';

export const clearMotionOrderResponseFormAction = ({ store }: ActionProps) => {
  store.unset(state.form.motionOrderResponse);
  store.unset(state.form.additionalText);
  store.unset(state.form.dueDate);
  store.unset(state.form.responseDate);
};
