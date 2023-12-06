/**
 * changes the route to file-a-petition/success
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToFilePetitionSuccessAction = async ({
  router,
}: ActionProps) => {
  await router.route('/file-a-petition/success');
};
