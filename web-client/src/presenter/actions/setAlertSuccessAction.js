import { state } from 'cerebral';

export default ({ props, store }) => {
  store.set(state.alertSuccess, props.alertSuccess);
};
