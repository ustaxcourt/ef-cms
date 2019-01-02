import { state } from 'cerebral';

export default ({ props, store }) => {
  if (props.path) {
    store.set(state.path, props.path);
  }
};
