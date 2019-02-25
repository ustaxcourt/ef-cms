import { state } from 'cerebral';

export const NavigateToCognitoAction = async ({ get, router }) => {
  const path = get(state.cognitoLoginUrl);
  await router.route(path);
};
