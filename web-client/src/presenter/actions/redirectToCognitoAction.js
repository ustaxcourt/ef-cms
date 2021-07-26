import { state } from 'cerebral';

export const redirectToCognitoAction = ({ get, router }) => {
  router.externalRoute(get(state.cognitoLoginUrl));
};
