import { state } from 'cerebral';

/**
 * changes the route to view the message detail for the message thread
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToMessageDetailAction = async ({ get, router }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const parentMessageId = get(state.parentMessageId);

  await router.route(
    `/case-messages/${docketNumber}/message-detail/${parentMessageId}`,
  );
};
