/**
 * changes the route to the practitioner detail page for the given props.barNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const navigateToPractitionerDetailAction = async ({ props, router }) => {
  const { barNumber } = props;

  if (barNumber) {
    await router.route(`/practitioner-detail/${barNumber}`);
  }
};
