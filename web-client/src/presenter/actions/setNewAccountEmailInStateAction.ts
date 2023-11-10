import { state } from '@web-client/presenter/app.cerebral';

export const setNewAccountEmailInStateAction = ({
  props,
  store,
}: ActionProps) => {
  const { email } = props;

  store.set(state.cognito.email, email);
};
