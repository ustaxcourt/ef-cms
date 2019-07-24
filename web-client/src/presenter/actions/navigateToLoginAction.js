/**
 * changes the route to the log-in page
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToLoginAction = async ({ router }) => {
  await router.route('/mock-log-in');
};
