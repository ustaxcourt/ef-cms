import { state } from 'cerebral';

/**
 * sets the state.users to the props.users passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.users
 * @param {object} providers.props the cerebral props object used for getting the props.users
 */
export const setUsersAction = ({ store, props }) => {
  store.set(state.users, props.users);
};
