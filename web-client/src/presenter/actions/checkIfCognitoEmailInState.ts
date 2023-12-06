import { state } from '@web-client/presenter/app.cerebral';

export const checkIfCognitoEmailInState = ({ get, path }: ActionProps) => {
  const email = get(state.cognito.email);
  if (email) return path.exists();
  return path.doesNotExist();
};
