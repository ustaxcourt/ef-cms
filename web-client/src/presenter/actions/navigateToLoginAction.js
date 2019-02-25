/**
 * changes the route to the log-in page
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 */
export const navigateToLoginAction = async ({ router }) => {
  await router.route('/mock-log-in');
};
