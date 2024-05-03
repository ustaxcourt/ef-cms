import { state } from '@web-client/presenter/app.cerebral';

export const clearValidationMessageAction = ({ props, store }: ActionProps) => {
  store.unset(state.validationErrors[props.key]);
};
