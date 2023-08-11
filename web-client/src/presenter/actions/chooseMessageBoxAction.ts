import { state } from '@web-client/presenter/app.cerebral';

/**
 * Used for changing the message queue (my, section) and box (inbox, outbox, completed) from props
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {*} returns the next action in the sequence's path
 */
export const chooseMessageBoxAction = ({ path, props, store }: ActionProps) => {
  store.set(state.messageBoxToDisplay.queue, props.queue);
  store.set(state.messageBoxToDisplay.box, props.box);

  const messageBoxPath = `${props.queue}${props.box}`;

  return path[messageBoxPath]();
};
