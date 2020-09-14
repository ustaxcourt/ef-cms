import { state } from 'cerebral';

/**
 * sets the state.documentId based on the props.correspondenceId passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.documentId
 * @param {object} providers.props the cerebral props object used for passing the props.correspondenceId
 */
export const setDocumentIdFromCorrespondenceAction = ({ props, store }) => {
  store.set(state.docketEntryId, props.correspondenceId); // TODO 636 - state.docketEntryId should be more generic
};
