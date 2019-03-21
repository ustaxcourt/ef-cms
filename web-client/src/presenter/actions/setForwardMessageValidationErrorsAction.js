import { state } from 'cerebral';

export const setForwardMessageValidationErrorsAction = ({ props, store }) => {
  store.set(state.validationErrors[props.workItemId], props.errors);
};
