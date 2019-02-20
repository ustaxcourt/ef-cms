import { state } from 'cerebral';

/**
 * sets the state.documentId based on the props.documentId passed in
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting the state.documentId
 * @param {Object} providers.props the cerebral props object used for passing the props.documentId
 */
export default ({ store, props }) => {
  store.set(state.documentId, props.documentId);
};
