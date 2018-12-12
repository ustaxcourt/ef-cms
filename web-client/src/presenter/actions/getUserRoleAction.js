import { state } from 'cerebral';

export default ({ get, path }) => {
  const user = get(state.user);
  return path[user.role]();
};
