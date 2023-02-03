import { state } from 'cerebral';

/**
 * sets the state.parentMessageId from props.parentMessageId
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.parentMessageId
 * @param {object} providers.store the cerebral store used for setting the state.parentMessageId
 */
export const setParentMessageIdAction = ({ props, store }) => {
  store.set(state.parentMessageId, props.parentMessageId);
};
