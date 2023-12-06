import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.screenMetadata.<key> to the props.value passed in
 * @param {object} providers the providers object
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 */
export const setScreenMetadataValueAction = ({ props, store }: ActionProps) => {
  store.set(state.screenMetadata[props.key], props.value);
};
