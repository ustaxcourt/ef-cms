/**
 * changes the route to the dashboard, which is "/"
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToDashboardAction = async ({ router }: ActionProps) => {
  await router.route('/');
};
