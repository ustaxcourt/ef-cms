/**
 * changes the route to the printable docket record page
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @returns {Promise} async action
 */
export const navigateToPrintableDocketRecordAction = async ({
  props,
  router,
}) => {
  await router.route(
    `/case-detail/${props.docketNumber}/printable-docket-record`,
  );
};
