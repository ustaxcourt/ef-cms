import { state } from 'cerebral';

export default ({ store }) => {
  store.set(state.completeForm, {});
  store.set(state.form, {});
};
