import { state } from 'cerebral';

/**
 * Fetches the details about a practitioner
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} containing practitionerDetail
 */

export const getPractitionerDetailAction = async ({
  applicationContext,
  get,
  props,
}) => {
  const { barNumber } = props;
  const currentPractitionerDetail = get(state.practitionerDetail);

  if (
    currentPractitionerDetail &&
    currentPractitionerDetail.barNumber === barNumber
  ) {
    // we already have detail in state, so return that
    return {
      practitionerDetail: currentPractitionerDetail,
    };
  } else {
    // fetch practitionerDetail from use case
    const practitionerDetail = await applicationContext
      .getUseCases()
      .getPractitionerByBarNumberInteractor({
        applicationContext,
        barNumber,
      });

    return { practitionerDetail };
  }
};
