import { state } from 'cerebral';

export default ({ props, store, get }) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  store.set(state.selectedWorkItems, [...selectedWorkItems, props.workItem]);
};
