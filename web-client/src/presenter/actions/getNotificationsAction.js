/**
 * Fetches the case usign the getCase use case using the props.docketNumber
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.user.token
 * @param {object} providers.applicationContext needed for getting the getCase use case
 * @returns {object} contains the caseDetail returned from the use case
 */
export const getNotificationsAction = async ({ applicationContext }) => {
  const notifications = await applicationContext
    .getUseCases()
    .getNotificationsInteractor({
      applicationContext,
    });

  return { notifications };
};
