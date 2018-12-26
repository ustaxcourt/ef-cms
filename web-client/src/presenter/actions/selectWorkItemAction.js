import { state } from 'cerebral';

export default ({ props, store, get }) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  if (
    selectedWorkItems.find(
      workItem => workItem.workItemId === props.workItem.workItemId,
    )
  ) {
    store.set(
      state.selectedWorkItems,
      selectedWorkItems.filter(
        workItem => workItem.workItemId !== props.workItem.workItemId,
      ),
    );
  } else {
    store.set(state.selectedWorkItems, [...selectedWorkItems, props.workItem]);
  }
};
