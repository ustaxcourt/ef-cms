import { state } from 'cerebral';

export const setValidationErrorsByFlagAction = ({ props, store }) => {
  if (props.fromModal) {
    store.set(state.modal.validationErrors, props.errors);
  } else {
    store.set(state.validationErrors, props.errors);
  }
};
