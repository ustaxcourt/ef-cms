import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const loginHelper = (get: Get): { disableLoginButton: boolean } => {
  const { email, password } = get(state.authentication.form);

  const disableLoginButton = !email || !password;
  return { disableLoginButton };
};
