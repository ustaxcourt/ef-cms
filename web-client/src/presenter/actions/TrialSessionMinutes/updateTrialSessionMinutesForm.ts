import { state } from '@web-client/presenter/app.cerebral';

export const getFormattedTrialSessionCasesAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  store.set(state.form.cases, props.cases);
  return;
};
