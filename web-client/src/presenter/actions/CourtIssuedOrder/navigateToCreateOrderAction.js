import { state } from 'cerebral';

/**
 * changes the route to view the create order page for the props.docketNumber and messageId
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @returns {Promise} async action
 */
export const navigateToCreateOrderAction = async ({ get, props, router }) => {
  const messageId = get(state.messageId);
  if (messageId) {
    await router.route(
      `/case-detail/${props.docketNumber}/create-order/${messageId}`,
    );
  } else {
    await router.route(`/case-detail/${props.docketNumber}/create-order`);
  }
};
