import { state } from 'cerebral';
import { UnidentifiedUserError } from '../errors/UnidentifiedUserError';

export default ({ get, path }) => {
  const user = get(state.user);
  if (!user || !user.role) {
    throw new UnidentifiedUserError();
  }
  return path[user.role]();
};
