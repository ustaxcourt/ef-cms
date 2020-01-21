import { state } from 'cerebral';

/**
 * changes the route to view the print preview of a document related to the caseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToPrintPreviewAction = async ({ get, props, router }) => {
  const caseId =
    props.caseId ||
    (props.caseDetail
      ? props.caseDetail.caseId
      : get(state.caseDetail.docketNumber));

  await router.route(`/print-preview/${caseId}`);
};
