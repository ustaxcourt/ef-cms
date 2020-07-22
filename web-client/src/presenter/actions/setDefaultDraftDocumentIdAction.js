import { state } from 'cerebral';

/**
 * sets the state.screenMetadata.draftDocumentId based on the props.draftDocumentId passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.screenMetadata.draftDocumentId
 * @param {object} providers.props the cerebral props object used for passing the props.draftDocumentId
 */
export const setDefaultDraftDocumentIdAction = ({ props, store }) => {
  store.set(state.screenMetadata.draftDocumentId, props.draftDocumentId);
};
