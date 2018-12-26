import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.sectionWorkQueue, props.workItems);
};
