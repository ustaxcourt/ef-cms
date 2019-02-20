/**
 * changes the route to the dashboard, which is "/"
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 */
export default async ({ router }) => {
  await router.route('/');
};
