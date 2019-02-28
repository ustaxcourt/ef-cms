import { state } from 'cerebral';

export const navigateToCognitoAction = async ({ get, router }) => {
  const path = get(state.cognitoLoginUrl);
  await router.route(path);
};
