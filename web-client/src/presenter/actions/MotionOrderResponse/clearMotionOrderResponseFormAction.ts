import { state } from '@web-client/presenter/app.cerebral';

export const clearMotionOrderResponseFormAction = ({ store }: ActionProps) => {
  store.unset(state.form.consolidatedGroupOrderFor);
  store.unset(state.form.motionOrderResponse);
  store.unset(state.form.additionalOrderText);
  store.unset(state.form.dueDate);
  store.unset(state.form.responseDate);
  store.unset(state.form.strickenFromTrialSession);
};
