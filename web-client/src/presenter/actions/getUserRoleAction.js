import { state } from 'cerebral';

/**
 * get the role associated with the user
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.user
 * @param {Object} providers.path the cerebral path object used for invoking the next path in the sequence based on the user's role
 * @returns {Object} the path to call based on the user role
 */
export const getUserRoleAction = ({ get, path }) => {
  const user = get(state.user);
  return path[user.role]();
};
