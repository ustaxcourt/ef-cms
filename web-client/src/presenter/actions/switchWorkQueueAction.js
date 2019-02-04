import { state } from 'cerebral';

export default ({ store, props, path }) => {
  store.set(state.workQueueToDisplay, { queue: props.queue, box: props.box });
  const workQueuePath = `${props.queue}${props.box}`;
  return path[workQueuePath]();
};
