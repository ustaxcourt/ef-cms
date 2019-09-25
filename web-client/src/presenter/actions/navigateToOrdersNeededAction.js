import { state } from 'cerebral';

/**
 * changes the route to view the orders needed summary for a given petition
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @returns {Promise} async action
 */
export const navigateToOrdersNeededAction = async ({ get, props, router }) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);
  if (docketNumber) {
    await router.route(`/case-detail/${docketNumber}/orders-needed`);
  }
};
