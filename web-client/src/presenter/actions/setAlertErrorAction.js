import { state } from 'cerebral';

export default ({ props, store }) => {
  store.set(state.alertError, props.alertError);
};
