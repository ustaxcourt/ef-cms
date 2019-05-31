/**
 * fetch all the internal users in the system (used for forwarding work items to other users)
 *
 * @param {object} applicationContext the application context used for getting the getInternalUsers use case
 * @returns {string} the list of internal users
 */
export const getInternalUsersAction = async ({ applicationContext }) => {
  const users = await applicationContext
    .getUseCases()
    .getInternalUsers({ applicationContext });
  return { users };
};
