/**
 * changes the route to view the create order page for the props.docketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @returns {Promise} async action
 */
export const navigateToCreateOrderAction = async ({ props, router }) => {
  await router.route(`/case-detail/${props.docketNumber}/create-order`);
};
