import { state } from 'cerebral';

export default async ({ get, router }) => {
  const path = get(state.path);
  await router.route(path);
};
