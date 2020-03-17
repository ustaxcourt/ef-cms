/**
 * changes the route to view the case-detail of the caseId of props.caseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToSignOrderAction = async ({ props, router }) => {
  const { caseId, documentId } = props;
  await router.route(`/case-detail/${caseId}/edit-order/${documentId}/sign`);
};
