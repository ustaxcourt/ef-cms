/**
 * changes the route to view the case-detail of the caseId of props.caseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const navigateToFirstResultCaseDetailAction = async ({
  props,
  router,
}) => {
  router.route(`/case-detail/${props.searchResults[0].docketNumber}`);
};
