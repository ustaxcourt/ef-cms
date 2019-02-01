import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.workQueue.section.inbox, props.workItems);
};
