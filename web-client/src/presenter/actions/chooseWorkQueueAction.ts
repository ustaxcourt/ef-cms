import { state } from '@web-client/presenter/app.cerebral';

const DEFAULT_QUEUE_PREFS = {
  box: 'inbox',
  queue: 'my',
};
/**
 * Used for changing which work queue (myself, section) and box (inbox, outbox).
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.props.queue the queue to display
 * @param {object} providers.props.box the inbox / output in the queue to display
 * @param {object} providers.store the cerebral store object used for setting workQueueToDisplay
 * @returns {*} returns the next action in the sequence's path
 */
export const chooseWorkQueueAction = ({
  get,
  path,
  props,
  store,
}: ActionProps) => {
  if (props.queue) {
    store.set(state.workQueueToDisplay.queue, props.queue);
  }

  if (props.box) {
    store.set(state.workQueueToDisplay.box, props.box);
  }

  const queuePrefs = {
    ...DEFAULT_QUEUE_PREFS,
    ...get(state.workQueueToDisplay),
  };

  let workQueuePath = `documentqc${queuePrefs.queue}${queuePrefs.box}`;

  if (typeof path[workQueuePath] !== 'function') {
    throw new Error(`Work queue path "${workQueuePath}" not found`);
  }
  return path[workQueuePath]();
};
