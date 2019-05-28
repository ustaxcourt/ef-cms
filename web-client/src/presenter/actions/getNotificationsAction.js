/**
 * Fetches the case usign the getCase use case using the props.docketNumber
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {Object} providers.applicationContext needed for getting the getCase use case
 * @returns {Object} contains the caseDetail returned from the use case
 */
export const getNotificationsAction = async ({ applicationContext }) => {
  const notifications = await applicationContext
    .getUseCases()
    .getNotifications({
      applicationContext,
    });

  return { notifications };
};
