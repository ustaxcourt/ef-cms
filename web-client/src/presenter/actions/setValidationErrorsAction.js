import { state } from 'cerebral';

export const setValidationErrorsAction = ({ props, store }) => {
  store.set(state.validationErrors, props.errors);
};
