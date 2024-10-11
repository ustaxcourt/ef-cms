import { state } from '@web-client/presenter/app.cerebral';

export const startShowEmailConfirmationFormValidationAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.showValidation[props.field], props.showValidation);
};
