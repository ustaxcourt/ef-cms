import { state } from 'cerebral';

export const redirectToCognitoAction = async ({ get }) => {
  const path = get(state.cognitoLoginUrl);
  window.location.replace(path);
};
