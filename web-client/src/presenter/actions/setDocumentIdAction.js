import { state } from 'cerebral';

/**
 * sets the state.docketEntryId based on the props.docketEntryId passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.documentId
 * @param {object} providers.props the cerebral props object used for passing the props.documentId
 */
export const setDocumentIdAction = ({ props, store }) => {
  store.set(state.docketEntryId, props.docketEntryId);
};
