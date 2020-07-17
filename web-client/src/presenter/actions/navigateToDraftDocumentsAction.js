import { state } from 'cerebral';

/**
 * changes the route to view the draft-documents of the caseId of props.caseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToDraftDocumentsAction = async ({
  get,
  props,
  router,
}) => {
  const docketNumber =
    props.docketNumber ||
    (props.caseDetail
      ? props.caseDetail.docketNumber
      : get(state.caseDetail.docketNumber));

  if (docketNumber) {
    await router.route(`/case-detail/${docketNumber}/draft-documents`);
  }
};
