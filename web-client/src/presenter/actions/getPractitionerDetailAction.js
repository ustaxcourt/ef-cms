import { state } from 'cerebral';

/**
 * Fetches the details about a practitioner
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} contains the details of a trial session
 */

export const getPractitionerDetailAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { barNumber } = props;
  let practitionerDetail = get(state.practitionerDetail);

  if (practitionerDetail && practitionerDetail.barNumber === barNumber) {
    // we already have detail in state, so return that
    return {
      practitionerDetail,
    };
  } else {
    // fetch practitionerDetail from use case
    practitionerDetail = await applicationContext
      .getUseCases()
      .getPractitionerByBarNumberInteractor({
        applicationContext,
        barNumber,
      });
  }

  // TODO: Handle not found
  return practitionerDetail;
};
