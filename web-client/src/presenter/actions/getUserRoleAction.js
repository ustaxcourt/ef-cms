import { state } from 'cerebral';

/**
 * get the role associated with the user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function used for getting the state.user
 * @param {object} providers.path the cerebral path object used for invoking the next path in the sequence based on the user's role
 * @returns {object} the path to call based on the user role
 */
export const getUserRoleAction = ({ applicationContext, get, path }) => {
  const user = get(state.user);
  const USER_ROLES = get(state.constants.USER_ROLES);

  if (applicationContext.getUtilities().isExternalUser(user.role)) {
    return path[user.role]();
  } else if (applicationContext.getUtilities().isInternalUser(user.role)) {
    if (
      [
        USER_ROLES.petitionsClerk,
        USER_ROLES.docketClerk,
        USER_ROLES.judge,
      ].includes(user.role)
    ) {
      return path[user.role]();
    } else {
      return path.otherInternalUser();
    }
  }
};
