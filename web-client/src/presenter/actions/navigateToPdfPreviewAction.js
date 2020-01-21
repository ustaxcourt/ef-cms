/**
 * changes the route to the simple pdf preview page
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToPdfPreviewAction = async ({ router }) => {
  await router.route('/pdf-preview');
};
