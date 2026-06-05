import { state } from '@web-client/presenter/app.cerebral';

export const clearGrantDenyMotionDependentFieldsAction = ({
  props,
  store,
}: ActionProps) => {
  if (
    props.key === 'dueDateMessage' &&
    (props.value === null || props.value === undefined || props.value === '')
  ) {
    store.unset(state.form.dueDate);
    store.unset(state.form.filingParty);
  }
};
