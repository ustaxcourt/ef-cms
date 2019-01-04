import { state } from 'cerebral';

export default ({ get, store, props }) => {
  const queue = get(state.workQueue).map(item => {
    if (item.workItemId === props.workItemId) {
      item.isFocused = !item.isFocused;
    }
    return item;
  });
  store.set(state.workQueue, queue);
};
