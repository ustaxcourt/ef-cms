import { state } from 'cerebral';

export default ({ store, props }) => {
  store.set(state.users, props.users);
};
