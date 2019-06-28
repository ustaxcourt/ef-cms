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
export const chooseWorkQueueAction = ({ get, path, props, store }) => {
  if (props.hasOwnProperty('workQueueIsInternal')) {
    store.set(state.workQueueIsInternal, props.workQueueIsInternal);
  }

  if (props && props.queue) {
    store.set(state.workQueueToDisplay.queue, props.queue);
  }

  if (props && props.box) {
    store.set(state.workQueueToDisplay.box, props.box);
  }

  let queuePrefs = get(state.workQueueToDisplay);
  let workQueueIsInternal = get(state.workQueueIsInternal);
  let workQueuePath = `${queuePrefs.queue}${queuePrefs.box}`;

  if (workQueueIsInternal && queuePrefs.queue === 'my') {
    workQueuePath = `messages${workQueuePath}`;
  }

  if (
    workQueueIsInternal &&
    queuePrefs.queue === 'section' &&
    queuePrefs.box === 'inbox'
  ) {
    workQueuePath = `messages${workQueuePath}`;
  }

  if (
    !workQueueIsInternal &&
    queuePrefs.queue === 'my' &&
    queuePrefs.box === 'inbox'
  ) {
    workQueuePath = `documentqc${workQueuePath}`;
  }

  if (
    !workQueueIsInternal &&
    queuePrefs.queue === 'my' &&
    queuePrefs.box === 'batched'
  ) {
    workQueuePath = `documentqc${workQueuePath}`;
  }

  if (
    !workQueueIsInternal &&
    queuePrefs.queue === 'my' &&
    queuePrefs.box === 'outbox'
  ) {
    workQueuePath = `documentqc${workQueuePath}`;
  }

  console.log('workQueuePath', workQueuePath);

  return path[workQueuePath]();
};
