/**
 * changes the route to the log-in page
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 */
export default async ({ router }) => {
  await router.route('/log-in');
};
