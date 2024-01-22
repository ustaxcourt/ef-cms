import { state } from '@web-client/presenter/app.cerebral';

export const setResetPasswordAction = ({
  props,
  store,
}: ActionProps<{
  email: string;
  code: string;
  userId: string;
}>): void => {
  store.set(state.authentication.userEmail, props.email);
  store.set(state.authentication.code, props.code);
  //store.set(state.authentication.forgotPassword.userId, props.userId);
};
