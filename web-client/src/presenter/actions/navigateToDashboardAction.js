/**
 * changes the route to the dashboard, which is "/"
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 */
export const navigateToDashboardAction = async ({ router }) => {
  await router.route('/');
};
