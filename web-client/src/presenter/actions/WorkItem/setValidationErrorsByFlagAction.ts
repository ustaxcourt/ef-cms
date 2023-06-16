import { state } from '@web-client/presenter/app.cerebral';

export const setValidationErrorsByFlagAction = ({
  props,
  store,
}: ActionProps) => {
  if (props.fromModal) {
    store.set(state.modal.validationErrors, props.errors);
  } else {
    store.set(state.validationErrors, props.errors);
  }
};
