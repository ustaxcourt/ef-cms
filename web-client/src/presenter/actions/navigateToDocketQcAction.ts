import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to view the case detail
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props
 * @param {object} providers.get the cerebral get method
 * @returns {Promise} async action
 */
export const navigateToDocketQcAction = async ({
  get,
  props,
  router,
}: ActionProps) => {
  const docketNumber =
    props.docketNumber ||
    (props.caseDetail
      ? props.caseDetail.docketNumber
      : get(state.caseDetail.docketNumber));

  const { docketEntryId } = props;

  const { FROM_PAGES } = get(state.constants);

  if (docketNumber) {
    await router.route(
      `/case-detail/${docketNumber}/documents/${docketEntryId}/edit?fromPage=${FROM_PAGES.caseDetail}`,
    );
  }
};
