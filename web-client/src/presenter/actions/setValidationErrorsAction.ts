import { state } from '@web-client/presenter/app.cerebral';

export const setValidationErrorsAction = ({ props, store }: ActionProps) => {
  store.set(state.validationErrors, props.errors);
};
