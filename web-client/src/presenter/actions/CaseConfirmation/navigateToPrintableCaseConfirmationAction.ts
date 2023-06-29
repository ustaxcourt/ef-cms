/**
 * changes the route to the printable case confirmation page
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} asynchronous action
 */
export const navigateToPrintableCaseConfirmationAction = async ({
  props,
  router,
}: ActionProps) => {
  await router.route(`/case-detail/${props.docketNumber}/confirmation`);
};
