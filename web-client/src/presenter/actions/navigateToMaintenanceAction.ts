/**
 * changes the route to /maintenance
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToMaintenanceAction = async ({ router }: ActionProps) => {
  await router.route('/maintenance');
};
