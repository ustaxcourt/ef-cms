/**
 * changes the route to view the case-detail of the caseId of props.caseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @returns {Promise} async action
 */
export const navigateToCaseDetailAction = async ({ router, props }) => {
  await router.route(`/case-detail/${props.caseId}`);
};
