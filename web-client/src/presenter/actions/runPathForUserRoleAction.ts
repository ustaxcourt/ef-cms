/**
 * get the role associated with the user
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.path the cerebral path object used for invoking the next path in the sequence based on the user's role
 * @returns {object} the path to call based on the user role
 */
export const runPathForUserRoleAction = ({
  applicationContext,
  path,
}: ActionProps) => {
  const user = applicationContext.getCurrentUser();

  if (typeof path[user.role] !== 'function') {
    throw new Error(`No path available for ${JSON.stringify(user)}`);
  }

  return path[user.role]();
};
