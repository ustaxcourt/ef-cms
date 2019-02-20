import { state } from 'cerebral';

export default async ({ get }) => {
  const path = get(state.cognitoLoginUrl);
  window.location.replace(path);
};
