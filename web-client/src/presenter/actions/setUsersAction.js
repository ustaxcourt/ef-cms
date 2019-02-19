import { state } from 'cerebral';

/**
 * sets the state.users to the props.users passed in.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.store the cerebral store used for setting state.users
 * @param {Object} providers.props the cerebral props object used for getting the props.users
 */
export default ({ store, props }) => {
  store.set(state.users, props.users);
};
