/**
 * changes the route to /user/contact/edit
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToEditUserContactAction = async ({
  router,
}: ActionProps) => {
  await router.route('/user/contact/edit');
};
