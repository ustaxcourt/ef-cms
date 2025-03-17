import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.parentMessageId from props.parentMessageId
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.parentMessageId
 * @param {object} providers.store the cerebral store used for setting the state.parentMessageId
 */
export const setParentMessageIdAction = ({ props, store }: ActionProps) => {
  console.log('setting parentMessageId', props.parentMessageId);
  store.set(state.parentMessageId, props.parentMessageId);
};
