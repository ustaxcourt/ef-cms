import { state } from '@web-client/presenter/app.cerebral';

export const clearOptionalFieldsStampFormAction = ({ store }: ActionProps) => {
  store.unset(state.form.strickenFromTrialSession);
  store.unset(state.form.jurisdictionalOption);
  store.unset(state.form.dueDateMessage);
  store.set(state.form.customText, '');
  store.unset(state.form.date);
};
