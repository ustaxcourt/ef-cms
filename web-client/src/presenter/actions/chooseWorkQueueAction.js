import { state } from 'cerebral';

/**
 * Used for changing which work queue (myself, section) and box (inbox, outbox).
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.props.queue the queue to display
 * @param {object} providers.props.box the inbox / output in the queue to display
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @param {Function} providers.get the cerebral get function
 * @returns {*} returns the next action in the sequence's path
 */
export const chooseWorkQueueAction = ({ store, props, path, get }) => {
  if (props && props.queue && props.box) {
    store.set(state.workQueueToDisplay, { box: props.box, queue: props.queue });
  } else if (props && props.box) {
    // sometimes it queue is set in another sequence and this is called without a queue.
    store.set(state.workQueueToDisplay.box, props.box);
  }
  let queuePrefs = get(state.workQueueToDisplay);
  const workQueuePath = `${queuePrefs.queue}${queuePrefs.box}`;
  return path[workQueuePath]();
};
