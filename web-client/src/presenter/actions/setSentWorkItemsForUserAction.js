import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.workQueue.myQueue.outbox, props.workItems);
};
