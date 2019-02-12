import { state } from 'cerebral';

export default async ({ get, router }) => {
  const path = get(state.cognitoLoginUrl);
  await router.route(path);
};
