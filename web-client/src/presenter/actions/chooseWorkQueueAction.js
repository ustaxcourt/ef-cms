import { state } from 'cerebral';

export default ({ store, props, path, get }) => {
  if (props && props.queue && props.box) {
    store.set(state.workQueueToDisplay, { queue: props.queue, box: props.box });
  }
  let queuePrefs = get(state.workQueueToDisplay);
  const workQueuePath = `${queuePrefs.queue}${queuePrefs.box}`;
  return path[workQueuePath]();
};
