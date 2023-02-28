import { state } from 'cerebral';

/**
 * sets the state.docketEntryId based on the props.correspondenceId passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.docketEntryId
 * @param {object} providers.props the cerebral props object used for passing the props.correspondenceId
 */
export const setDocketEntryIdFromCorrespondenceAction = ({ props, store }) => {
  store.set(state.docketEntryId, props.correspondenceId);
};
