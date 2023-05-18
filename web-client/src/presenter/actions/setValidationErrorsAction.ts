import { state } from 'cerebral';

export const setValidationErrorsAction = ({ props, store }: ActionProps) => {
  store.set(state.validationErrors, props.errors);
};
