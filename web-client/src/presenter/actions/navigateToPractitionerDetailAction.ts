import { state } from '@web-client/presenter/app.cerebral';

/**
 * changes the route to the practitioner detail page for the given props.barNumber
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral function to retrieve information from state
 * @param {object} providers.router the riot.router object that is used for changing the route
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const navigateToPractitionerDetailAction = async ({
  get,
  props,
  router,
}: ActionProps) => {
  const userBarNumber = get(state.form.barNumber);
  const barNumber = props.barNumber || userBarNumber;

  if (barNumber) {
    await router.route(`/practitioner-detail/${barNumber}`);
  }
};
