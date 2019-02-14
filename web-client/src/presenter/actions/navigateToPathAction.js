import { state } from 'cerebral';

export default async ({ get, router, props }) => {
  const path = props.path || get(state.path);
  await router.route(path);
};
