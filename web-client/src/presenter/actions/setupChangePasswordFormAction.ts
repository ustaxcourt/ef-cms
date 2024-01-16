import { state } from '@web-client/presenter/app.cerebral';

export const setupChangePasswordFormAction = ({
  props,
  store,
}: ActionProps) => {
  const { tempPassword, userEmail } = props;

  store.set(state.form.tempPassword, tempPassword);
  store.set(state.form.userEmail, userEmail);
};
