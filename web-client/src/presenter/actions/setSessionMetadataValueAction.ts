import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the value of state.sessionMetadata.<key> from the provided props.value
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props props passed through via cerebral
 */
export const setSessionMetadataValueAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.sessionMetadata[props.key], props.value);
};
