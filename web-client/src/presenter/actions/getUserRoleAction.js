import { state } from 'cerebral';

/**
 * get the role associated with the user
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.user
 * @param {object} providers.path the cerebral path object used for invoking the next path in the sequence based on the user's role
 * @returns {object} the path to call based on the user role
 */
export const getUserRoleAction = ({ get, path }) => {
  const user = get(state.user);
  return path[user.role]();
};
