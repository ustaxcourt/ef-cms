import { state } from 'cerebral';

/**
 * changes the route to view the case-detail of the docketNumber of props.docketNumber and also sets the tab to the case information
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.docketNumber
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToCaseDetailCaseInformationActionFactory = caseInformationTab => async ({
  get,
  props,
  router,
}) => {
  const docketNumber =
    props.docketNumber ||
    (props.caseDetail
      ? props.caseDetail.docketNumber
      : get(state.caseDetail.docketNumber));

  console.log('dockt number', docketNumber);

  if (docketNumber) {
    console.log('111111111');
    let url = `/case-detail/${docketNumber}/case-information`;

    if (caseInformationTab) {
      console.log('22222222');
      url += `?caseInformationTab=${caseInformationTab}`;
    }
    await router.route(url);
  }
};
