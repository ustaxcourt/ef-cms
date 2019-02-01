import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.workQueue.section.outbox, props.workItems);
};
