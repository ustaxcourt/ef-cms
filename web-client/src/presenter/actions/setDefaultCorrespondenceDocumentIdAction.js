import { state } from 'cerebral';

/**
 * sets the state.screenMetadata.correspondenceDocumentId based on the props.correspondenceDocumentId passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.correspondenceDocumentId
 * @param {object} providers.props the cerebral props object used for passing the props.correspondenceDocumentId
 */
export const setDefaultCorrespondenceDocumentIdAction = ({ props, store }) => {
  store.set(
    state.screenMetadata.correspondenceDocumentId,
    props.correspondenceDocumentId,
  );
};
