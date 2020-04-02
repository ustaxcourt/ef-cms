import { state } from 'cerebral';

/**
 * Fetches the details about a practitioner
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.practitionerUserId
 * @returns {object} contains the details of a trial session
 */

export const getPractitionerDetailAction = ({ get, props }) => {
  const { practitionerUserId } = props;
  let practitionerDetail = get(state.practitionerDetail);

  if (practitionerDetail && practitionerDetail.userId === practitionerUserId) {
    // we already have detail in state, so return that
    return {
      practitionerDetail,
    };
  } else {
    // fetch practitionerDetail from use case
  }
};
