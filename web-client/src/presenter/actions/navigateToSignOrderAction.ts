import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to view the case-detail of the docketNumber of props.docketNumber
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props that contain the props.docketNumber
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToSignOrderAction = async ({
  get,
  props,
  router,
}: ActionProps) => {
  const { docketEntryId, docketNumber } = props;
  const parentMessageId = get(state.parentMessageId);
  let route = `/case-detail/${docketNumber}/edit-order/${docketEntryId}/sign`;
  if (parentMessageId) {
    route += `/${parentMessageId}`;
  }
  await router.route(route);
};
