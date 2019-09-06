import { state } from 'cerebral';

export const redirectToCognitoAction = async ({ get, router }) => {
  router.externalRoute(get(state.cognitoLoginUrl));
};
