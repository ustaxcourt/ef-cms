/**
 * fetch all the internal users in the system (used for forwarding work items to other users)
 *
 * @param {Object} applicationContext the application context used for getting the getInternalUsers use case
 * @returns {string} the list of internal users
 */
export default async ({ applicationContext }) => {
  const users = await applicationContext
    .getUseCases()
    .getInternalUsers({ applicationContext });
  return { users };
};
