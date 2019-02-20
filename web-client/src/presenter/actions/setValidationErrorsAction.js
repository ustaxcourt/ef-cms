import { state } from 'cerebral';

export default ({ props, store }) => {
  store.set(state.validationErrors, props.errors);
};
