import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.currentViewMetadata.messageId based on the props.messageId passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.currentViewMetadata.messageId
 * @param {object} providers.props the cerebral props object used for passing the props.messageId
 */
export const setMessageIdAction = ({ props, store }: ActionProps) => {
  store.set(state.currentViewMetadata.messageId, props.messageId);
};
