import { state } from 'cerebral';
import { UnidentifiedUserError } from '../errors/UnidentifiedUserError';

export default ({ applicationContext, get, path }) => {
  const user = get(state.user);
  if (
    (applicationContext.getCurrentEnvironment() !== 'local' && !user) ||
    !user.role
  ) {
    throw new UnidentifiedUserError();
  }
  return path[user.role]();
};
