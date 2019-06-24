import { state } from 'cerebral';

export const navigateToCognitoAction = ({ get, router }) => {
  const path = get(state.cognitoLoginUrl);
  router.externalRoute(path);
};
