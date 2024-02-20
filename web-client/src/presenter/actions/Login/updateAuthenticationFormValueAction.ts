import { state } from '@web-client/presenter/app.cerebral';

export const updateAuthenticationFormValueAction = ({
  props,
  store,
}: ActionProps<{
  confirmPassword?: string;
  email?: string;
  password?: string;
  code?: string;
}>) => {
  if ('confirmPassword' in props) {
    store.set(state.authentication.form.confirmPassword, props.confirmPassword);
  }
  if ('email' in props) {
    store.set(state.authentication.form.email, props.email);
  }
  if ('password' in props) {
    store.set(state.authentication.form.password, props.password);
  }
  if ('code' in props) {
    store.set(state.authentication.code, props.code);
  }
};
