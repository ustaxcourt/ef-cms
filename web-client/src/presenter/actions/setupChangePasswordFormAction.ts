import { state } from '@web-client/presenter/app.cerebral';

export const setupChangePasswordFormAction = ({
  props,
  store,
}: ActionProps) => {
  const { session, userEmail } = props;

  store.set(state.form.session, session);
  store.set(state.form.userEmail, userEmail);
};
