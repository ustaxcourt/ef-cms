/**
 * changes the route to view the case-detail of the caseId of props.caseId
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.router the riot.router object that is used for changing the route
 * @param {Object} providers.props the cerebral props that contain the props.caseId
 */
export const navigateToCaseDetailAction = async ({ router, props }) => {
  await router.route(`/case-detail/${props.caseId}`);
};
