import { state } from 'cerebral';

/**
 * updates the state.sessionMetadata
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.props the cerebral props object
 */
export const updateSessionMetadataAction = ({ props, store }) => {
  store.set(state.sessionMetadata[props.key], props.value);
};
