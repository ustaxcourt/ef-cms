import { state } from '@web-client/presenter/app.cerebral';

export const setupChangePasswordAction = ({
  props,
  store,
}: ActionProps<{ email: string; tempPassword: string }>) => {
  const { email, tempPassword } = props;

  store.set(state.showPassword, false);
  store.set(state.authentication.tempPassword, tempPassword);
  store.set(state.authentication.form.email, email);
};
