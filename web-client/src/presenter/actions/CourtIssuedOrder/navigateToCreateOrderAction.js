import { state } from 'cerebral';

/**
 * changes the route to view the create order page for the props.docketNumber and parentMessageId
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.caseId
 * @returns {Promise} async action
 */
export const navigateToCreateOrderAction = async ({ get, props, router }) => {
  const parentMessageId = get(state.modal.parentMessageId);
  if (parentMessageId) {
    await router.route(
      `/case-detail/${props.docketNumber}/create-order/${parentMessageId}`,
    );
  } else {
    await router.route(`/case-detail/${props.docketNumber}/create-order`);
  }
};
