import { state } from 'cerebral';

export default ({ props, store }) => {
  store.set(state.assigneeId, props.assigneeId);
  store.set(state.assigneeName, props.assigneeName);
};
