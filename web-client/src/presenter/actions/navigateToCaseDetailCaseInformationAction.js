import { state } from 'cerebral';

/**
 * changes the route to view the case-detail of the caseId of props.caseId and also sets the tab to the case information
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToCaseDetailCaseInformationAction = async ({
  get,
  props,
  router,
}) => {
  const caseId =
    props.caseId ||
    props.docketNumber ||
    (props.caseDetail
      ? props.caseDetail.caseId
      : get(state.caseDetail.docketNumber));

  if (caseId) {
    await router.route(`/case-detail/${caseId}/case-information`);
  }
};
