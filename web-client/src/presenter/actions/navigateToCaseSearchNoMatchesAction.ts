/**
 * changes the route to view the case search no matches page
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToCaseSearchNoMatchesAction = async ({
  router,
}: ActionProps) => {
  await router.route('/search/no-matches');
};
