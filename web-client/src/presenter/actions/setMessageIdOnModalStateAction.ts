import { state } from 'cerebral';

/**
 * sets the state.parentMessageId to the props.parentMessageId passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setMessageIdOnModalStateAction = ({ props, store }) => {
  store.set(state.modal.parentMessageId, props.parentMessageId);
};
