import { state } from 'cerebral';

/**
 * Used for changing the message queue (my, section) and box (inbox, outbox, completed) from props
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props object
 */
export const chooseMessageBoxAction = ({ props, store }) => {
  if (props.queue) {
    store.set(state.messageBoxToDisplay.queue, props.queue);
  }

  if (props.box) {
    store.set(state.messageBoxToDisplay.box, props.box);
  }
};
