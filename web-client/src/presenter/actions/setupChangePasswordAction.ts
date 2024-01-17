import { state } from '@web-client/presenter/app.cerebral';

export const setupChangePasswordAction = ({ props, store }: ActionProps) => {
  const { tempPassword, userEmail } = props;

  store.set(state.showPassword, false);
  store.set(state.authentication.tempPassword, tempPassword);
  store.set(state.authentication.userEmail, userEmail);
};
