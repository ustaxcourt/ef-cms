import { state } from '@web-client/presenter/app.cerebral';

export const updateAuthenticationFormValueAction = ({
  props,
  store,
}: ActionProps<{
  confirmPassword?: string;
  email?: string;
  password?: string;
}>) => {
  if (props.confirmPassword) {
    store.set(state.authentication.form.confirmPassword, props.confirmPassword);
  }
  if (props.email) {
    store.set(state.authentication.form.email, props.email);
  }
  if (props.password) {
    store.set(state.authentication.form.password, props.password);
  }
};
