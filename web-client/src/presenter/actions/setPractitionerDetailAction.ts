import { state } from 'cerebral';

/**
 * sets the state.practitionerDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.practitionerDetail
 * @param {object} providers.store the cerebral store used for setting the state.practitionerDetail
 */
export const setPractitionerDetailAction = ({ props, store }) => {
  store.set(state.practitionerDetail, props.practitionerDetail);
};
