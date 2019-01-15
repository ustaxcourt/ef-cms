import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.workItem, props.workItem);
};
