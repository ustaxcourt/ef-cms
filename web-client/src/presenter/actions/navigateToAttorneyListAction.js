/**
 * changes the route to /users/attorney-list
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToAttorneyListAction = async ({ router }) => {
  await router.route('/users/attorney-list');
};
