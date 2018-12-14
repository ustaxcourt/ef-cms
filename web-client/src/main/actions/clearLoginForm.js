import { state } from 'cerebral';

export default ({ store }) => {
  store.set(state.form, {
    name: '',
  });
};
